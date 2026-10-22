"use client";

import {
  useCallback,
  useEffect,
  useMemo,
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
  Sparkles,
} from "lucide-react";

type Phase =
  | "closed"
  | "opening"
  | "open";

const reveal = {
  initial: {
    opacity: 0,
    y: 28,
  },

  whileInView: {
    opacity: 1,
    y: 0,
  },

  viewport: {
    once: true,
    margin: "-12% 0px",
  },

  transition: {
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1] as const,
  },
};

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

function CornerFloral({
  side,
}: {
  side: "left" | "right";
}) {
  return (
    <div
      className={`nh-floral nh-floral-${side}`}
      aria-hidden="true"
    >
      <span className="nh-leaf leaf-a">
        ❧
      </span>

      <span className="nh-leaf leaf-b">
        ❧
      </span>

      <span className="nh-flower flower-a">
        ✿
      </span>

      <span className="nh-flower flower-b">
        ❀
      </span>

      <span className="nh-flower flower-c">
        ✦
      </span>
    </div>
  );
}

function useCountdown() {
  const target = useMemo(
    () =>
      new Date(
        "2026-11-09T21:00:00+05:00"
      ).getTime(),
    []
  );

  const [
    remaining,
    setRemaining,
  ] = useState(() =>
    Math.max(
      0,
      target - Date.now()
    )
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

  const pad = (
    value: number
  ) =>
    String(value).padStart(
      2,
      "0"
    );

  return {
    days: Math.floor(
      remaining /
        86400000
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

function Envelope({
  opening,
  onOpen,
}: {
  opening: boolean;
  onOpen: () => void;
}) {
  return (
    <section
      className={`nh-envelope-screen ${
        opening
          ? "is-opening"
          : ""
      }`}
    >
      <div className="nh-envelope-background">
        <span />
        <span />
        <span />
      </div>

      <motion.div
        className="nh-envelope-stage"
        animate={
          opening
            ? {
                y: -20,
                scale: 1.035,
              }
            : {
                y: 0,
                scale: 1,
              }
        }
        transition={{
          duration: 1.3,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <div className="nh-envelope-shadow" />

        <div className="nh-envelope-body">
          <div className="nh-envelope-back" />

          <motion.div
            className="nh-letter"
            animate={
              opening
                ? {
                    y: -145,
                    scale:
                      1.03,
                  }
                : {
                    y: 0,
                    scale: 1,
                  }
            }
            transition={{
              delay:
                opening
                  ? 0.55
                  : 0,
              duration:
                1.35,
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

            <div className="nh-letter-monogram">
              N
              <span>
                &amp;
              </span>
              H
            </div>

            <strong>
              Nimra
              &amp;
              Hamza
            </strong>
          </motion.div>

          <div className="nh-envelope-left" />
          <div className="nh-envelope-right" />
          <div className="nh-envelope-bottom" />

          <motion.div
            className="nh-envelope-flap"
            animate={
              opening
                ? {
                    rotateX:
                      180,
                  }
                : {
                    rotateX:
                      0,
                  }
            }
            transition={{
              duration:
                1.05,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          />

          <motion.button
            type="button"
            className="nh-seal"
            onClick={
              onOpen
            }
            aria-label="Open wedding invitation"
            animate={
              opening
                ? {
                    opacity:
                      0,
                    scale:
                      0.75,
                  }
                : {
                    opacity:
                      1,
                    scale: 1,
                  }
            }
            transition={{
              duration:
                0.4,
            }}
          >
            <span>
              N
            </span>

            <i>
              ✦
            </i>

            <span>
              H
            </span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="nh-envelope-caption"
        animate={{
          opacity:
            opening
              ? 0
              : 1,
        }}
      >
        <p>
          You&apos;re
          Invited
        </p>

        <span>
          TAP THE SEAL TO
          OPEN
        </span>
      </motion.div>
    </section>
  );
}

function EventCard({
  index,
  title,
  date,
  time,
  isHome,
  venue,
  address,
}: {
  index: string;
  title: string;
  date: string;
  time: string;
  isHome?: boolean;
  venue?: string;
  address?: string;
}) {
  return (
    <motion.article
      {...reveal}
      className="nh-event-card"
    >
      <div className="nh-event-inner-border" />

      <span className="nh-event-number">
        {index}
      </span>

      <Sparkles
        className="nh-event-spark"
        size={18}
      />

      <h3>
        {title}
      </h3>

      <GoldDivider />

      <div className="nh-event-row">
        <CalendarDays
          size={16}
        />

        <span>
          {date}
        </span>
      </div>

      <div className="nh-event-row">
        <Clock3
          size={16}
        />

        <span>
          {time}
        </span>
      </div>

      {isHome ? (
        <div className="nh-home-detail">
          <span>
            AN INTIMATE
            CELEBRATION
          </span>

          <strong>
            At the
            Bride&apos;s
            Residence
          </strong>
        </div>
      ) : null}

      {venue ? (
        <div className="nh-venue-detail">
          <MapPin
            size={18}
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
          className="nh-venue-button"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${venue} ${address}`
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin
            size={14}
          />

          View Venue
        </a>
      ) : null}
    </motion.article>
  );
}

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

  const {
    scrollYProgress,
  } = useScroll();

  const progress =
    useSpring(
      scrollYProgress,
      {
        stiffness:
          75,
        damping:
          22,
      }
    );

  const openInvitation =
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

      window.setTimeout(
        () => {
          setPhase(
            "open"
          );

          window.scrollTo(
            {
              top: 0,
            }
          );
        },
        2400
      );
    }, [phase]);

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
              scale:
                1.03,
              filter:
                "blur(8px)",
            }}
            transition={{
              duration:
                0.85,
            }}
          >
            <Envelope
              opening={
                phase ===
                "opening"
              }
              onOpen={
                openInvitation
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
            <div className="nh-hero-shimmer" />

            <div className="nh-hero-glow glow-one" />
            <div className="nh-hero-glow glow-two" />

            <CornerFloral side="left" />
            <CornerFloral side="right" />

            <div className="nh-main-arch">
              <div className="nh-main-arch-inner" />
            </div>

            <motion.div
              className="nh-top-monogram"
              initial={{
                opacity: 0,
                y: -18,
                scale:
                  0.8,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration:
                  1.2,
              }}
            >
              <span>
                N
              </span>

              <i>
                &amp;
              </i>

              <span>
                H
              </span>
            </motion.div>

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
                delay:
                  0.22,
                duration:
                  1.2,
              }}
            >
              <p className="nh-overline">
                WEDDING
                INVITATION
              </p>

              <div className="nh-bismillah-wrap">
                <p className="nh-bismillah">
                  بِسْمِ ٱللَّٰهِ
                  ٱلرَّحْمَٰنِ
                  ٱلرَّحِيمِ
                </p>

                <p className="nh-bismillah-en">
                  In the name of
                  Allah, the Most
                  Gracious, the
                  Most Merciful
                </p>
              </div>

              <GoldDivider />

              <p className="nh-host">
                MRS. JAVED
              </p>

              <p className="nh-request">
                requests the
                pleasure of your
                company at the
                wedding celebration
                of her beloved
                daughter
              </p>

              <div className="nh-couple">
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

              <div className="nh-date-medallion">
                <div className="nh-date-ring">
                  <div className="nh-date-numbers">
                    <strong>
                      09
                    </strong>

                    <i>
                      —
                    </i>

                    <strong>
                      10
                    </strong>
                  </div>

                  <span>
                    NOVEMBER
                  </span>

                  <small>
                    2026
                  </small>
                </div>
              </div>

              <p className="nh-scroll">
                SCROLL TO
                DISCOVER
              </p>
            </motion.div>
          </section>

          {/* VERSE */}

          <section className="nh-section nh-verse-section">
            <motion.div
              {...reveal}
              className="nh-verse-card"
            >
              <span className="nh-card-star">
                ✦
              </span>

              <p className="nh-section-overline">
                A BLESSING
              </p>

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

              <p className="nh-verse-english">
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
                30:21
              </p>
            </motion.div>
          </section>

          {/* COUNTDOWN */}

          <section className="nh-section nh-countdown-section">
            <div className="nh-countdown-decoration one">
              ✦
            </div>

            <div className="nh-countdown-decoration two">
              ✦
            </div>

            <motion.div
              {...reveal}
              className="nh-countdown-content"
            >
              <p className="nh-light-overline">
                THE CELEBRATION
                BEGINS IN
              </p>

              <h2>
                Counting
                Down
                <br />
                to Forever
              </h2>

              <GoldDivider />

              <div className="nh-countdown">
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
                    MIN
                  </span>
                </div>

                <div>
                  <strong>
                    {
                      countdown.seconds
                    }
                  </strong>

                  <span>
                    SEC
                  </span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* EVENTS */}

          <section className="nh-section nh-events-section">
            <motion.div
              {...reveal}
              className="nh-events-heading"
            >
              <p className="nh-section-overline">
                SAVE THE
                DATES
              </p>

              <h2>
                Wedding
                <br />
                Celebrations
              </h2>

              <p>
                Your presence
                will make these
                cherished
                moments even
                more beautiful.
                We warmly invite
                you to celebrate
                with us.
              </p>
            </motion.div>

            <div className="nh-event-list">
              <EventCard
                index="01"
                title="Mehndi"
                date="09 November 2026"
                time="9:00 PM"
                isHome
              />

              <EventCard
                index="02"
                title="Baraat"
                date="10 November 2026"
                time="2:00 PM"
                venue="Royal Palace Marquee"
                address="Fatehpur, Layyah"
              />
            </div>
          </section>

          {/* PRESENCE */}

          <section className="nh-section nh-presence-section">
            <motion.div
              {...reveal}
              className="nh-presence-card"
            >
              <span className="nh-presence-star">
                ✦
              </span>

              <p className="nh-light-overline">
                A GENTLE
                REQUEST
              </p>

              <h2>
                Your
                Presence
                <br />
                Is Our
                Honour
              </h2>

              <p>
                We sincerely
                hope you will
                join us and
                bless the
                couple with
                your love,
                prayers and
                presence.
              </p>

              <span className="nh-presence-star bottom">
                ✦
              </span>
            </motion.div>
          </section>

          {/* CLOSING */}

          <section className="nh-section nh-closing-section">
            <motion.div
              {...reveal}
              className="nh-closing-content"
            >
              <div className="nh-closing-monogram">
                N
                <span>
                  &amp;
                </span>
                H
              </div>

              <p className="nh-section-overline">
                WITH LOVE
                &amp; DUAS
              </p>

              <h2>
                We Look
                Forward to
                Celebrating
                With You
              </h2>

              <GoldDivider />

              <p className="nh-closing-message">
                May this new
                beginning be
                filled with
                love, happiness
                and countless
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
        </>
      )}
    </main>
  );
}