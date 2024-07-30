// this should match the enum in backend codebase. This is text displayed for a context visually too - on Emote cards
export enum EMOTE_CONTEXTS {
  NO_CONTEXT = 'no context',
  NOU = 'No U',
  WHYSPIA = 'whyspia',
  NANA = 'nana-context',
  PARALLEL = 'parallel',
  VIBE_CAFE = 'Vibe Cafe',
  VIBE_CAMP = 'Vibe Camp',
  AKIYA_COLLECTIVE = 'Akiya Collective',
  PINGPPL = 'pingppl',
  SEND_OR_DEFINE_SYMBOL = 'send or define symbol',
}

// contexts that are ready and usable
export const EMOTE_CONTEXTS_ACTIVE = [
  EMOTE_CONTEXTS.PINGPPL,
  EMOTE_CONTEXTS.NOU,
  EMOTE_CONTEXTS.SEND_OR_DEFINE_SYMBOL,
  EMOTE_CONTEXTS.NANA,
  EMOTE_CONTEXTS.NO_CONTEXT,
  
]

export const getContextPagePath = (context: string) => {
  if (context === EMOTE_CONTEXTS.NO_CONTEXT) return '/'
  if (context === EMOTE_CONTEXTS.NOU) return '/context/nou'
  if (context === EMOTE_CONTEXTS.WHYSPIA) return '/context/whyspia'
  if (context === EMOTE_CONTEXTS.NANA) return '/context/nana'
  if (context === EMOTE_CONTEXTS.PARALLEL) return '/context/parallel'
  if (context === EMOTE_CONTEXTS.PINGPPL) return '/context/pingppl'
  if (context === EMOTE_CONTEXTS.SEND_OR_DEFINE_SYMBOL) return '/desire/search'
}

export const getContextSummary = (context: string) => {
  if (context === EMOTE_CONTEXTS.NO_CONTEXT) return 'can think of this as the home context or just no context'
  if (context === EMOTE_CONTEXTS.NOU) return 'send any symbol to someone. wait for them to send a symbol back. keep up streaks. very similar to Facebook pokes. good way to send a hug to someone or just let them know you are thinking about them'
  if (context === EMOTE_CONTEXTS.WHYSPIA) return ''
  if (context === EMOTE_CONTEXTS.NANA) return 'context for shmoji\'s nana'
  if (context === EMOTE_CONTEXTS.PARALLEL) return 'be with others'
  if (context === EMOTE_CONTEXTS.PINGPPL) return 'plan and send events that people can follow. stay up to date with people and help them stay up to date with you'
  if (context === EMOTE_CONTEXTS.SEND_OR_DEFINE_SYMBOL) return 'send a symbol or define a symbol. these should probably be separate contexts and they may not make sense rn, but let this cook'
}
