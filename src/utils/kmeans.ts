import cluster from "cluster";

export const kMeansClustering = (data: any[], k: number) => {
  // implementasi algoritma k-means
  return data.map((d, i) => ({ ...d, cluster: i % k })); // dummy clustering
};
