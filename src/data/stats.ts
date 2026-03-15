export interface ArtistStat {
  label: string;
  value: number;
  suffix?: string;
}

export const artistStats: ArtistStat[] = [
  { label: "Total Streams", value: 6.13, suffix: "M+" },
  { label: "Monthly Listeners", value: 9, suffix: "K+" },
];
