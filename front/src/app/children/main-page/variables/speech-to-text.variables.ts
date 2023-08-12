export const HOST = 'smartspeech.sber.ru';
export const OPTIONS = {
    language: 'ru-RU',
    model: 'general',
    hypotheses_count: 1,
    enable_partial_results: false,
    enable_multi_utterance: false,
    enable_profanity_filter: false,
    no_speech_timeout: {seconds: 7},
    max_speech_timeout: {seconds: 20},
    hints: {
        words: [],
        enable_letters: false,
        hints_eou_timeout: { seconds: 0 },
    },
};
