// this should match the enum in backend codebase. This is text displayed for a context visually too - on Emote cards
export enum EMOTE_CONTEXTS {
  NO_CONTEXT = 'home',
  NOU = 'No U',
  WHYSPIA = 'whyspia',
  NANA = 'nana-context',
  PARALLEL = 'parallel',
  VIBE_CAFE = 'Vibe Cafe',
  VIBE_CAMP = 'Vibe Camp',
  AKIYA_COLLECTIVE = 'Akiya Collective',
  NOTIF = 'notif',
  TAU = 'thinking about u',
  CURRENTLY = 'currently',
  PLACE_CONTEXT = 'place-context',
}

// contexts that are ready and usable
export const EMOTE_CONTEXTS_ACTIVE = [
  EMOTE_CONTEXTS.CURRENTLY,
  EMOTE_CONTEXTS.TAU,
  EMOTE_CONTEXTS.NOTIF,
  EMOTE_CONTEXTS.NOU,
  EMOTE_CONTEXTS.NO_CONTEXT,
]

export const getContextPagePath = (place: string) => {
  if (place === EMOTE_CONTEXTS.NO_CONTEXT) return '/'
  if (place === EMOTE_CONTEXTS.NOU) return '/place/nou'
  if (place === EMOTE_CONTEXTS.WHYSPIA) return '/place/whyspia'
  if (place === EMOTE_CONTEXTS.NANA) return '/place/nana'
  if (place === EMOTE_CONTEXTS.PARALLEL) return '/place/parallel'
  if (place === EMOTE_CONTEXTS.NOTIF) return '/place/notif'
  if (place === EMOTE_CONTEXTS.TAU) return '/place/thinking-about-u'
  if (place === EMOTE_CONTEXTS.CURRENTLY) return '/place/currently'
}

export const getContextSummary = (place: string) => {
  if (place === EMOTE_CONTEXTS.NO_CONTEXT) return 'the front door of whyspia (the home page)'
  if (place === EMOTE_CONTEXTS.NOU) return 'send any symbol to someone. wait for them to send a symbol back. keep up streaks. very similar to Facebook pokes. good way to send a hug to someone or just let them know you are thinking about them'
  if (place === EMOTE_CONTEXTS.WHYSPIA) return ''
  if (place === EMOTE_CONTEXTS.NANA) return 'context for shmoji\'s nana'
  if (place === EMOTE_CONTEXTS.PARALLEL) return 'be with others'
  if (place === EMOTE_CONTEXTS.NOTIF) return 'notify others with specific symbols. follow specific symbols of others'
  if (place === EMOTE_CONTEXTS.TAU) return 'tell someone ur thinking about them or see if anyone is thinking about u'
  if (place === EMOTE_CONTEXTS.CURRENTLY) return 'share with others what is current for you'
}
