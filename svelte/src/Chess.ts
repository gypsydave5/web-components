export type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'

export type Square = {
    rank: Rank,
    file: File
}

export const squares: Square[] = Array.from({length: 64}).map((_, i: number) => {
    return {
        file: String.fromCharCode(97 + (i % 8)) as File,
        rank: String(Math.floor(Math.abs(i - 63) / 8) + 1) as Rank
    }
})