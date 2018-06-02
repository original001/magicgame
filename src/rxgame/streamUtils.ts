import * as flyd from "flyd";

type Stream<T> = flyd.Stream<T>;

export const resetAfter = <T>(time, s: Stream<T>) => {
  let timeout;
  return flyd.combine(
    (s, self: Stream<T>) => {
      if (s.hasVal) {
        clearTimeout(timeout);
        timeout = setTimeout(() => self(undefined), time);
      }
      return s();
    },
    [s]
  );
};

export const lazyZip = <S1, S2, S3>(
  s1: Stream<S1>,
  s2: Stream<S2>,
  s3: Stream<S3>
) =>
  flyd.combine((s1, s2, s3) => [s1(), s2(), s3()] as [S1, S2, S3], [ s1, s2, s3 ]);
