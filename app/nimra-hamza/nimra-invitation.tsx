"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Music2,
  Volume2,
  VolumeX,
} from "lucide-react";

type Phase =
  | "closed"
  | "opening"
  | "open";

const reveal = {
  initial: {
    opacity: 0,
    y: 26,
  },

  whileInView: {
    opacity: 1,
    y: 0,
  },

  viewport: {
    once: true,
    margin: "-10% 0px",
  },

  transition: {
    duration: 0.85,
    ease: [0.22, 1, 0.36, 1] as const,
  },
};

/* =====================================
   COUNTDOWN
===================================== */

function useCountdown() {
  const target = useMemo(
    () =>
      new Date(
        "2026-11-09T19:00:00+05:00"
      ).getTime(),
    []
  );

  const [
    remaining,
    setRemaining,
  ] = useState<number | null>(
    null
  );

  useEffect(() => {
    const update = () => {
      setRemaining(
        Math.max(
          0,
          target -
            Date.now()
        )
      );
    };

    update();

    const id =
      window.setInterval(
        update,
        1000
      );

    return () =>
      window.clearInterval(
        id
      );
  }, [target]);

  if (
    remaining ===
    null
  ) {
    return {
      days: "--",
      hours: "--",
      minutes: "--",
      seconds: "--",
    };
  }

  const pad = (
    n: number
  ) =>
    String(n).padStart(
      2,
      "0"
    );

  return {
    days: String(
      Math.floor(
        remaining /
          86400000
      )
    ),

    hours: pad(
      Math.floor(
        remaining /
          3600000
      ) % 24
    ),

    minutes: pad(
      Math.floor(
        remaining /
          60000
      ) % 60
    ),

    seconds: pad(
      Math.floor(
        remaining /
          1000
      ) % 60
    ),
  };
}

/* =====================================
   NEW AMBIENT MUSIC
===================================== */

function useAmbientMusic() {
  const [
    playing,
    setPlaying,
  ] =
    useState(false);

  const ctx =
    useRef<AudioContext | null>(
      null
    );

  const loop =
    useRef<
      number | null
    >(null);

  const playTone =
    useCallback(
      (
        frequency: number,
        delay: number,
        duration: number,
        volume: number
      ) => {
        if (
          !ctx.current
        ) {
          return;
        }

        const context =
          ctx.current;

        const start =
          context.currentTime +
          delay;

        const oscillator =
          context.createOscillator();

        const gain =
          context.createGain();

        oscillator.type =
          "sine";

        oscillator.frequency.setValueAtTime(
          frequency,
          start
        );

        gain.gain.setValueAtTime(
          0.0001,
          start
        );

        gain.gain.exponentialRampToValueAtTime(
          volume,
          start + 0.12
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          start +
            duration
        );

        oscillator.connect(
          gain
        );

        gain.connect(
          context.destination
        );

        oscillator.start(
          start
        );

        oscillator.stop(
          start +
            duration +
            0.2
        );
      },
      []
    );

  const sequence =
    useCallback(() => {
      const melody = [
        [392.0, 0],
        [493.88, 0.85],
        [587.33, 1.7],
        [659.25, 2.55],
        [587.33, 3.4],
        [523.25, 4.25],
        [493.88, 5.1],
        [440.0, 5.95],
      ] as const;

      melody.forEach(
        ([
          frequency,
          delay,
        ]) => {
          playTone(
            frequency,
            delay,
            2.2,
            0.025
          );

          playTone(
            frequency / 2,
            delay,
            3.1,
            0.012
          );
        }
      );
    }, [playTone]);

  const start =
    useCallback(
      async () => {
        if (
          typeof window ===
          "undefined"
        ) {
          return;
        }

        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          )
            .webkitAudioContext;

        if (
          !AudioContextClass
        ) {
          return;
        }

        if (
          !ctx.current
        ) {
          ctx.current =
            new AudioContextClass();
        }

        await ctx.current.resume();

        setPlaying(
          true
        );

        sequence();

        if (
          loop.current
        ) {
          window.clearInterval(
            loop.current
          );
        }

        loop.current =
          window.setInterval(
            sequence,
            7200
          );
      },
      [sequence]
    );

  const stop =
    useCallback(() => {
      setPlaying(
        false
      );

      if (
        loop.current
      ) {
        window.clearInterval(
          loop.current
        );

        loop.current =
          null;
      }

      if (
        ctx.current?.state ===
        "running"
      ) {
        void ctx.current.suspend();
      }
    }, []);

  useEffect(() => {
    return () => {
      if (
        loop.current
      ) {
        window.clearInterval(
          loop.current
        );
      }

      if (
        ctx.current &&
        ctx.current.state !==
          "closed"
      ) {
        void ctx.current.close();
      }
    };
  }, []);

  return {
    playing,
    start,
    stop,
  };
}

/* =====================================
   DECORATION
===================================== */

function GoldDivider() {
  return (
    <div
      className="nh-divider"
      aria-hidden="true"
    >
      <span />
      <i>✦</i>
      <span />
    </div>
  );
}

function CornerOrnament({
  position,
}: {
  position:
    | "tl"
    | "tr"
    | "bl"
    | "br";
}) {
  return (
    <div
      className={`nh-corner nh-corner-${position}`}
      aria-hidden="true"
    >
      <span className="nh-corner-vine">
        ❧
      </span>

      <span className="nh-corner-flower">
        ✦
      </span>
    </div>
  );
}

/* =====================================
   ENVELOPE
===================================== */

function Envelope({
  opening,
  onOpen,
}: {
  opening: boolean;
  onOpen: () => void;
}) {
  return (
    <section className="nh-envelope-screen">
      <div className="nh-envelope-bg">
        <div className="nh-envelope-bg-ring r1" />
        <div className="nh-envelope-bg-ring r2" />
      </div>

      <motion.div
        className="nh-envelope-stage"
        animate={
          opening
            ? {
                y: -12,
                scale: 1.025,
              }
            : {
                y: 0,
                scale: 1,
              }
        }
        transition={{
          duration: 1.1,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <div className="nh-envelope-shadow" />

        <div className="nh-envelope">
          <div className="nh-envelope-back" />

          <motion.div
            className="nh-envelope-letter"
            animate={
              opening
                ? {
                    y: -130,
                  }
                : {
                    y: 0,
                  }
            }
            transition={{
              delay:
                opening
                  ? 0.55
                  : 0,
              duration: 1.2,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <p>
              WEDDING
              INVITATION
            </p>

            <div className="nh-envelope-monogram">
              <strong>
                N
              </strong>

              <span>
                &amp;
              </span>

              <strong>
                H
              </strong>
            </div>

            <small>
              09 • 10
              NOVEMBER
              2026
            </small>
          </motion.div>

          <div className="nh-envelope-left" />
          <div className="nh-envelope-right" />
          <div className="nh-envelope-bottom" />

          <motion.div
            className="nh-envelope-flap"
            animate={{
              rotateX:
                opening
                  ? 180
                  : 0,
            }}
            transition={{
              duration: 1,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          />

          <motion.button
            className="nh-seal"
            type="button"
            onClick={
              onOpen
            }
            aria-label="Open invitation"
            animate={
              opening
                ? {
                    opacity: 0,
                    scale: 0.7,
                  }
                : {
                    opacity: 1,
                    scale: 1,
                  }
            }
          >
            N
            <i>✦</i>
            H
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="nh-envelope-copy"
        animate={{
          opacity:
            opening
              ? 0
              : 1,
        }}
      >
        <strong>
          You&apos;re
          Invited
        </strong>

        <span>
          TAP THE SEAL
          TO OPEN
        </span>
      </motion.div>
    </section>
  );
}

/* =====================================
   EVENTS
===================================== */

function EventCard({
  number,
  title,
  date,
  time,
  venue,
  address,
  atHome,
}: {
  number: string;
  title: string;
  date: string;
  time: string;
  venue?: string;
  address?: string;
  atHome?: boolean;
}) {
  return (
    <motion.article
      {...reveal}
      className="nh-event"
    >
      <div className="nh-event-frame" />

      <p className="nh-event-number">
        {number}
      </p>

      <div className="nh-event-glyph">
        ✦
      </div>

      <h3>
        {title}
      </h3>

      <GoldDivider />

      <div className="nh-event-meta">
        <div>
          <CalendarDays
            size={15}
          />

          <span>
            {date}
          </span>
        </div>

        <div>
          <Clock3
            size={15}
          />

          <span>
            {time}
          </span>
        </div>
      </div>

      {atHome ? (
        <div className="nh-home">
          <span>
            AN INTIMATE
            FAMILY
            CELEBRATION
          </span>

          <strong>
            Bride&apos;s
            Residence
          </strong>
        </div>
      ) : null}

      {venue ? (
        <div className="nh-venue">
          <MapPin
            size={17}
          />

          <div>
            <strong>
              {venue}
            </strong>

            {address ? (
              <span>
                {address}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {venue &&
      address ? (
        <a
          className="nh-map"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${venue} ${address}`
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin
            size={13}
          />

          View Venue
        </a>
      ) : null}
    </motion.article>
  );
}

/* =====================================
   MAIN
===================================== */

export default function NimraInvitation() {
  const [
    phase,
    setPhase,
  ] =
    useState<Phase>(
      "closed"
    );

  const countdown =
    useCountdown();

  const music =
    useAmbientMusic();

  const {
    scrollYProgress,
  } = useScroll();

  const progress =
    useSpring(
      scrollYProgress,
      {
        stiffness: 70,
        damping: 22,
      }
    );

  const open =
    useCallback(() => {
      if (
        phase !==
        "closed"
      ) {
        return;
      }

      setPhase(
        "opening"
      );

      void music.start();

      window.setTimeout(
        () => {
          setPhase(
            "open"
          );

          window.scrollTo({
            top: 0,
          });
        },
        2200
      );
    }, [
      phase,
      music,
    ]);

  useEffect(() => {
    const old =
      document.body
        .style
        .overflow;

    document.body.style.overflow =
      phase ===
      "open"
        ? ""
        : "hidden";

    return () => {
      document.body.style.overflow =
        old;
    };
  }, [phase]);

  return (
    <main className="nh-root">
      <AnimatePresence>
        {phase !==
          "open" && (
          <motion.div
            key="envelope"
            initial={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              filter:
                "blur(7px)",
              scale: 1.025,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <Envelope
              opening={
                phase ===
                "opening"
              }
              onOpen={
                open
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {phase ===
        "open" && (
        <>
          <motion.div
            className="nh-progress"
            style={{
              scaleX:
                progress,
            }}
          />

          {/* HERO */}

          <section className="nh-hero">
            <div className="nh-hero-light" />

            <CornerOrnament position="tl" />
            <CornerOrnament position="tr" />
            <CornerOrnament position="bl" />
            <CornerOrnament position="br" />

            <div className="nh-hero-frame">
              <div className="nh-hero-frame-inner" />
            </div>

            <motion.div
              className="nh-hero-content"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1.15,
              }}
            >
              <div className="nh-monogram">
                <span>N</span>
                <i>&amp;</i>
                <span>H</span>
              </div>

              <p className="nh-kicker">
                TOGETHER WITH
                THEIR FAMILIES
              </p>

              <div className="nh-bismillah-block">
                <p className="nh-bismillah">
                  بِسْمِ ٱللَّٰهِ
                  ٱلرَّحْمَٰنِ
                  ٱلرَّحِيمِ
                </p>

                <span>
                  In the name
                  of Allah,
                  the Most
                  Gracious,
                  the Most
                  Merciful
                </span>
              </div>

              <GoldDivider />

              <p className="nh-host">
                MRS. JAVED
              </p>

              <p className="nh-invites">
                cordially
                requests the
                pleasure of
                your company
                at the wedding
                celebrations
                of her beloved
                daughter
              </p>

              <div className="nh-names">
                <h1>
                  Nimra
                  Javed
                </h1>

                <div className="nh-weds">
                  <span />
                  <b>
                    WEDS
                  </b>
                  <span />
                </div>

                <h1>
                  Hamza
                  Ishfaq
                </h1>
              </div>

              <div className="nh-date">
                <strong>
                  09
                </strong>

                <div>
                  <span>
                    NOVEMBER
                  </span>

                  <i>
                    2026
                  </i>
                </div>

                <strong>
                  10
                </strong>
              </div>

              <p className="nh-scroll">
                SCROLL TO
                EXPLORE
              </p>
            </motion.div>
          </section>

          {/* VERSE */}

          <section className="nh-section nh-verse-section">
            <motion.div
              {...reveal}
              className="nh-ornate-card"
            >
              <div className="nh-ornate-border" />

              <p className="nh-eyebrow">
                A BLESSING
              </p>

              <span className="nh-star">
                ✦
              </span>

              <p className="nh-arabic">
                وَمِنْ آيَاتِهِ
                أَنْ خَلَقَ
                لَكُمْ مِنْ
                أَنْفُسِكُمْ
                أَزْوَاجًا
                لِتَسْكُنُوا
                إِلَيْهَا
                وَجَعَلَ
                بَيْنَكُمْ
                مَوَدَّةً
                وَرَحْمَةً
              </p>

              <GoldDivider />

              <p className="nh-verse">
                “And among His
                signs is that He
                created for you
                from yourselves
                mates that you
                may find
                tranquility in
                them; and He
                placed between
                you affection
                and mercy.”
              </p>

              <p className="nh-reference">
                SURAH AR-RUM
                · 30:21
              </p>
            </motion.div>
          </section>

          {/* COUNTDOWN */}

          <section className="nh-section nh-count-section">
            <motion.div
              {...reveal}
              className="nh-count-content"
            >
              <p className="nh-eyebrow light">
                UNTIL THE
                CELEBRATION
              </p>

              <h2>
                A Beautiful
                Beginning
              </h2>

              <GoldDivider />

              <div className="nh-counter">
                <div>
                  <strong>
                    {
                      countdown.days
                    }
                  </strong>

                  <span>
                    DAYS
                  </span>
                </div>

                <div>
                  <strong>
                    {
                      countdown.hours
                    }
                  </strong>

                  <span>
                    HOURS
                  </span>
                </div>

                <div>
                  <strong>
                    {
                      countdown.minutes
                    }
                  </strong>

                  <span>
                    MINUTES
                  </span>
                </div>

                <div>
                  <strong>
                    {
                      countdown.seconds
                    }
                  </strong>

                  <span>
                    SECONDS
                  </span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* EVENTS */}

          <section className="nh-section nh-events-section">
            <motion.div
              {...reveal}
              className="nh-section-intro"
            >
              <p className="nh-eyebrow">
                SAVE THE
                DATES
              </p>

              <h2>
                Wedding
                Celebrations
              </h2>

              <GoldDivider />

              <p>
                We warmly
                invite you to
                join us and
                bless the
                couple as we
                celebrate these
                cherished
                moments.
              </p>
            </motion.div>

            <div className="nh-events">
              <EventCard
                number="01"
                title="Mehndi"
                date="09 November 2026"
                time="7:00 PM"
                atHome
              />

              <EventCard
                number="02"
                title="Baraat"
                date="10 November 2026"
                time="1:00 PM – 3:00 PM"
                venue="Royal Palace Marquee"
                address="Fatehpur, Layyah"
              />
            </div>
          </section>

          {/* PRESENCE */}

          <section className="nh-section nh-presence-section">
            <motion.div
              {...reveal}
              className="nh-presence"
            >
              <div className="nh-presence-border" />

              <span className="nh-star">
                ✦
              </span>

              <p className="nh-eyebrow light">
                WITH LOVE
              </p>

              <h2>
                Your Presence
                <br />
                Is Our Honour
              </h2>

              <p>
                Your prayers
                and presence
                will make these
                celebrations
                even more
                meaningful and
                memorable for
                our family.
              </p>

              <span className="nh-star last">
                ✦
              </span>
            </motion.div>
          </section>

          {/* CLOSING */}

          <section className="nh-section nh-closing">
            <motion.div
              {...reveal}
              className="nh-closing-inner"
            >
              <div className="nh-closing-monogram">
                N
                <span>
                  &amp;
                </span>
                H
              </div>

              <p className="nh-eyebrow">
                WITH LOVE
                &amp; DUAS
              </p>

              <h2>
                We Look Forward
                to Celebrating
                With You
              </h2>

              <GoldDivider />

              <p>
                May Allah bless
                this beautiful
                beginning with
                love, peace,
                happiness and
                endless
                blessings.
              </p>

              <div className="nh-signoff">
                <span>
                  Warm Regards
                </span>

                <strong>
                  MRS. JAVED
                  &amp; FAMILY
                </strong>
              </div>
            </motion.div>
          </section>

          <button
            type="button"
            className="nh-music"
            aria-label={
              music.playing
                ? "Pause music"
                : "Play music"
            }
            onClick={() => {
              if (
                music.playing
              ) {
                music.stop();
              } else {
                void music.start();
              }
            }}
          >
            {music.playing ? (
              <Volume2
                size={16}
              />
            ) : (
              <VolumeX
                size={16}
              />
            )}

            <Music2
              size={11}
            />
          </button>
        </>
      )}
    </main>
  );
}