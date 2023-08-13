import { Injectable } from '@angular/core';
import { filter, from, fromEvent, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function sdpFilterCodec(kind: any, codec: any, realSdp: any) {
    var allowed = []
    var rtxRegex = new RegExp('a=fmtp:(\\d+) apt=(\\d+)\r$');
    var codecRegex = new RegExp('a=rtpmap:([0-9]+) ' + escapeRegExp(codec))
    var videoRegex = new RegExp('(m=' + kind + ' .*?)( ([0-9]+))*\\s*$')

    var lines = realSdp.split('\n');

    var isKind = false;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('m=' + kind + ' ')) {
            isKind = true;
        } else if (lines[i].startsWith('m=')) {
            isKind = false;
        }

        if (isKind) {
            var match = lines[i].match(codecRegex);
            if (match) {
                allowed.push(parseInt(match[1]));
            }

            match = lines[i].match(rtxRegex);
            if (match && allowed.includes(parseInt(match[2]))) {
                allowed.push(parseInt(match[1]));
            }
        }
    }

    var skipRegex = 'a=(fmtp|rtcp-fb|rtpmap):([0-9]+)';
    var sdp = '';

    isKind = false;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('m=' + kind + ' ')) {
            isKind = true;
        } else if (lines[i].startsWith('m=')) {
            isKind = false;
        }

        if (isKind) {
            var skipMatch = lines[i].match(skipRegex);
            if (skipMatch && !allowed.includes(parseInt(skipMatch[2]))) {
                continue;
            } else if (lines[i].match(videoRegex)) {
                sdp += lines[i].replace(videoRegex, '$1 ' + allowed.join(' ')) + '\n';
            } else {
                sdp += lines[i] + '\n';
            }
        } else {
            sdp += lines[i] + '\n';
        }
    }

    return sdp;
}

@Injectable({
    providedIn: 'root',
})
export class RtcService {

    public readonly videoStream$: Observable<MediaStream>;

    public readonly audioStream$: Observable<MediaStream>;

    public readonly pc: RTCPeerConnection;

    constructor(
        private readonly _http: HttpClient,
    ) {
        this.pc = new RTCPeerConnection();
        this.videoStream$ = fromEvent(this.pc, 'track')
            .pipe(
                map(event => event as RTCTrackEvent),
                filter(event => event.track.kind === 'video'),
                map(event => event.streams[0])
            );

        this.audioStream$ = fromEvent(this.pc, 'track')
            .pipe(
                map(event => event as RTCTrackEvent),
                filter(event => event.track.kind === 'audio'),
                map(event => event.streams[0])
            );
    }

    public startVideo(): Observable<void> {
        const constraints = {
            audio: false,
            video: {
                width: parseInt('1920', 0),
                height: parseInt('1080', 0)
            },
        };

        return from(navigator.mediaDevices.getUserMedia(constraints))
            .pipe(
                tap((stream) => {
                    stream.getTracks().forEach((track) => {
                        this.pc.addTrack(track, stream);
                    });
                }),
                switchMap(() => this.negotiate())
            );
    }

    public startAudio(): Observable<void> {
        const constraints = {
            audio: true,
            video: false,
        };

        return from(navigator.mediaDevices.getUserMedia(constraints))
            .pipe(
                tap((stream) => {
                    stream.getTracks().forEach((track) => {
                        this.pc.addTrack(track, stream);
                    });
                }),
                switchMap(() => this.negotiate())
            );
    }

    private negotiate(): Observable<void> {
        return from(this.pc.createOffer())
            .pipe(
                switchMap(offer => from(this.pc.setLocalDescription(offer))),
                switchMap(() => new Observable<void>(subscriber => {
                    if (this.pc.iceGatheringState === 'complete') {
                        subscriber.next();

                        return subscriber.complete();
                    }
                    const checkState = () => {
                        if (this.pc.iceGatheringState === 'complete') {
                            this.pc.removeEventListener('icegatheringstatechange', checkState);
                            subscriber.next();
                            subscriber.complete();
                        }
                    };
                    this.pc.addEventListener('icegatheringstatechange', checkState);
                })),
                switchMap(() => this.makeConnection()),
                map(answer => void this.pc.setRemoteDescription(answer))
            );
    }

    public makeConnection(): Observable<RTCSessionDescriptionInit> {
        const offer = this.pc.localDescription;

        return this._http.post<RTCSessionDescriptionInit>('/offer', {
            sdp: sdpFilterCodec('video', 'H264/90000', offer?.sdp),
            type: offer?.type,
            video_transform: 'none'
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    public stop(): void {
        if (this.pc.getTransceivers) {
            this.pc.getTransceivers().forEach(function (transceiver) {
                if (transceiver.stop) {
                    transceiver.stop();
                }
            });
        }

        // close local audio / video
        this.pc.getSenders().forEach(function (sender) {
            sender.track?.stop();
        });
        setTimeout(() => {
            this.pc.close()
        }, 500);
    }
}
