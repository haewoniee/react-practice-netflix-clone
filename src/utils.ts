export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export function sliceArray(arr: any[], offset: number, index: number) {
  if (offset * index + offset <= arr.length)
    return arr.slice(offset * index, offset * index + offset);
  else if (offset * index + offset <= arr.length + offset)
    return arr.slice(arr.length - 6, arr.length);
}
