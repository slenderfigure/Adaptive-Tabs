export interface Tab {
  header: string,
  content: {
    images?: string[],
    text?: string
  },
  order: number
}