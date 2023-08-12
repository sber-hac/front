import { Injectable } from '@angular/core';
import { filter, from, fromEvent, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root',
})
export class RtcService {

    public readonly videoStream$: Observable<MediaStream>;

    private readonly _pc: RTCPeerConnection;

    constructor(
        private readonly _http: HttpClient,
    ) {
        this._pc = new RTCPeerConnection();
        this.videoStream$ = fromEvent(this._pc, 'track')
            .pipe(
                map(event => event as RTCTrackEvent),
                filter(event => event.track.kind === 'video'),
                map(event =>  event.streams[0])
            );
    }

    public start(): Observable<void> {
        const constraints = {
            audio: false,
            video: true,
        };

        return from(navigator.mediaDevices.getUserMedia(constraints))
            .pipe(
                tap((stream) => {
                    stream.getTracks().forEach((track) => {
                        this._pc.addTrack(track, stream);
                    });
                }),
                switchMap(() => this.negotiate())
            );
    }

    private negotiate(): Observable<void> {
        return from(this._pc.createOffer())
            .pipe(
                switchMap(offer => from(this._pc.setLocalDescription(offer))),
                switchMap(() => new Observable<void>(subscriber => {
                    if (this._pc.iceGatheringState === 'complete') {
                        subscriber.next();

                        return subscriber.complete();
                    }
                    const checkState = () => {
                        if (this._pc.iceGatheringState === 'complete') {
                            this._pc.removeEventListener('icegatheringstatechange', checkState);
                            subscriber.next();
                            subscriber.complete();
                        }
                    };
                    this._pc.addEventListener('icegatheringstatechange', checkState);
                })),
                switchMap(() => this.makeConnection()),
                map(answer => void this._pc.setRemoteDescription(answer))
            );
    }

    private makeConnection(): Observable<RTCSessionDescriptionInit> {
        const offer = this._pc.localDescription;
        console.log(offer);

        return this._http.post<RTCSessionDescriptionInit>('/offer', {
            sdp: offer?.sdp,
            type: offer?.type,
            video_transform: 'none'
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}
