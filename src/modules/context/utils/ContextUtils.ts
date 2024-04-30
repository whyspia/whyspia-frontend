// this should match the enum in backend codebase. This is text displayed for a context visually too - on Emote cards
export enum EMOTE_CONTEXTS {
  NO_CONTEXT = 'no context',
  NOU = 'No U',
  WHYSPIA = 'whyspia',
  NANA = 'nana-context',
}

export const getContextPagePath = (context: string) => {
  if (context === EMOTE_CONTEXTS.NO_CONTEXT) return '/'
  if (context === EMOTE_CONTEXTS.NOU) return '/context/nou'
  if (context === EMOTE_CONTEXTS.WHYSPIA) return '/context/whyspia'
  if (context === EMOTE_CONTEXTS.NANA) return '/context/nana'
}
