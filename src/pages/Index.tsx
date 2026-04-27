import { useMemo, useState } from "react";
import { FunWheel } from "@/components/FunWheel";
import { DARES, fillTemplate } from "@/lib/dares";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, RotateCcw, Trophy, Skull } from "lucide-react";

type Phase = "setup" | "pick-loser" | "spinning" | "result";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("setup");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [loser, setLoser] = useState<string>("");
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [resultText, setResultText] = useState("");
  const [round, setRound] = useState(0);

  const players = useMemo(() => [p1, p2], [p1, p2]);

  const handleStart = () => {
    if (!p1.trim() || !p2.trim()) return;
    setRound(0);
    setPhase("pick-loser");
  };

  const selectLoser = (losingPlayer: string) => {
    const winningPlayer = losingPlayer === players[0] ? players[1] : players[0];
    setLoser(losingPlayer);

    const dareIdx = Math.floor(Math.random() * DARES.length);
    setTargetIndex(dareIdx);
    setResultText(fillTemplate(DARES[dareIdx].label, losingPlayer, winningPlayer));
    setPhase("spinning");
  };

  const handleSpinComplete = () => {
    setPhase("result");
  };

  const nextRound = () => {
    setRound((r) => r + 1);
    setPhase("pick-loser");
  };

  const resetAll = () => {
    setP1("");
    setP2("");
    setLoser("");
    setTargetIndex(null);
    setResultText("");
    setRound(0);
    setPhase("setup");
  };

  return (
    <main className="min-h-screen w-full px-5 py-8 flex flex-col items-center">
      <header className="w-full max-w-md text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border shadow-soft">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
            Spin of Fun
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black mt-3 leading-[1.05]">
          The Playful{" "}
          <span className="italic text-primary">Wheel</span>
        </h1>
        <p className="font-hand text-2xl text-muted-foreground mt-1">
          spin it, laugh, repeat
        </p>
      </header>

      {phase === "setup" && (
        <section className="w-full max-w-md bg-card rounded-3xl p-6 shadow-soft border border-border animate-pop-in">
          <h2 className="font-display text-2xl font-bold mb-1">Who's playing?</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Add both names to get started.
          </p>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Player 1
            </span>
            <Input
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              placeholder="e.g. Alex"
              className="mt-1 h-12 rounded-2xl text-base"
              autoComplete="off"
            />
          </label>

          <div className="my-3 flex items-center gap-3 text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span className="font-hand text-xl">vs</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Player 2
            </span>
            <Input
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              placeholder="e.g. Sam"
              className="mt-1 h-12 rounded-2xl text-base"
              autoComplete="off"
            />
          </label>

          <Button
            onClick={handleStart}
            disabled={!p1.trim() || !p2.trim()}
            className="w-full mt-6 h-13 py-3 rounded-2xl text-base font-semibold bg-gradient-warm hover:opacity-95 shadow-pop"
          >
            Let's play →
          </Button>
        </section>
      )}

      {phase === "pick-loser" && (
        <section className="w-full max-w-md flex flex-col items-center animate-pop-in">
          <div className="w-full bg-card rounded-3xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Skull className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Round {round + 1}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1">Who lost?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Tap the player who has to face the punishment.
            </p>

            <div className="flex gap-3">
              {players.map((name) => (
                <button
                  key={name}
                  onClick={() => selectLoser(name)}
                  className="flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-border bg-background hover:border-primary hover:bg-primary/5 active:scale-95 transition-all duration-150 group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-warm text-primary-foreground flex items-center justify-center font-display font-bold text-2xl shadow-pop group-hover:scale-105 transition-transform">
                    {name.trim().charAt(0).toUpperCase()}
                  </div>
                  <span className="font-display font-bold text-base leading-tight truncate w-full text-center">
                    {name}
                  </span>
                  <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors font-medium">
                    I lost
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={resetAll}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Change players
          </button>
        </section>
      )}

      {(phase === "spinning" || phase === "result") && (
        <section className="w-full max-w-md flex flex-col items-center">
          <div className="flex w-full justify-between items-center mb-5 px-1">
            <PlayerChip name={p1} side="left" isLoser={loser === p1} />
            <span className="font-hand text-2xl text-muted-foreground">vs</span>
            <PlayerChip name={p2} side="right" isLoser={loser === p2} />
          </div>

          <FunWheel
            dares={DARES}
            spinning={phase === "spinning"}
            targetIndex={targetIndex}
            onSpinComplete={handleSpinComplete}
          />

          <div className="mt-7 w-full">
            {phase === "spinning" && (
              <p className="text-center font-hand text-3xl text-primary animate-pulse">
                spinning…
              </p>
            )}

            {phase === "result" && (
              <div className="bg-card rounded-3xl p-5 border border-border shadow-soft animate-pop-in">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Trophy className="w-3.5 h-3.5 text-accent" />
                  Round {round + 1}
                </div>
                <p className="mt-2 font-display text-2xl font-bold leading-snug">
                  {resultText}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{loser}</span> drew the short straw this time.
                </p>
                <Button
                  onClick={nextRound}
                  className="w-full mt-5 h-12 rounded-2xl font-semibold bg-foreground text-background hover:bg-foreground/90"
                >
                  Next round
                </Button>
              </div>
            )}
          </div>

          <button
            onClick={resetAll}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Change players
          </button>
        </section>
      )}

      <footer className="mt-10 text-center font-hand text-lg text-muted-foreground">
        play nice, laugh hard ✨
      </footer>
    </main>
  );
};

const PlayerChip = ({ name, side, isLoser }: { name: string; side: "left" | "right"; isLoser?: boolean }) => {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className={`flex items-center gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
      <div className={`w-10 h-10 rounded-full text-primary-foreground flex items-center justify-center font-display font-bold text-lg shadow-pop transition-all ${isLoser ? "bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "bg-gradient-warm"}`}>
        {initial}
      </div>
      <div className={`flex flex-col ${side === "right" ? "items-end" : "items-start"}`}>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {isLoser ? "loser" : `Player ${side === "left" ? "1" : "2"}`}
        </span>
        <span className={`font-display font-bold text-base leading-tight max-w-[110px] truncate ${isLoser ? "text-primary" : ""}`}>
          {name}
        </span>
      </div>
    </div>
  );
};

export default Index;
