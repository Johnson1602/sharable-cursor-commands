// AIGC START
"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BASE_URL = "https://cursor.com/link/command";

export default function HomePage() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const generatedUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (name.trim()) params.set("name", name.trim());
    if (text.trim()) params.set("text", text.trim());
    const query = params.toString();
    return query ? `${BASE_URL}?${query}` : BASE_URL;
  }, [name, text]);

  const canCopy = name.trim().length > 0 && text.trim().length > 0;

  const handleCopy = async () => {
    if (!canCopy) {
      setCopyError("Fill in both fields before copying.");
      return;
    }
    setCopyError(null);
    setCopied(false);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
        return;
      }

      if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = generatedUrl;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const succeeded = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (succeeded) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
          return;
        }
      }

      throw new Error("Clipboard API unavailable");
    } catch (error) {
      console.error("Failed to copy", error);
      setCopyError("Clipboard copy failed. Please copy manually.");
    }
  };

  return (
    <main className="text-foreground min-h-screen bg-neutral-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-14">
        <div className="space-y-3">
          <h1 className="text-foreground text-4xl sm:text-5xl">
            Sharable Cursor Commands
          </h1>
          <p className="text-muted-foreground text-base">
            Provide the command name &amp; content, then copy the ready-to-share
            command link.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 shadow-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  className="text-muted-foreground text-sm font-medium"
                  htmlFor="command-name"
                >
                  Name
                </label>
                <Input
                  id="command-name"
                  placeholder="greeting"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-label="Command name"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-muted-foreground text-sm font-medium"
                  htmlFor="command-text"
                >
                  Text
                </label>
                <Textarea
                  id="command-text"
                  placeholder="Hello my friend, create your own sharable commands..."
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  aria-label="Command text"
                  rows={8}
                  className="min-h-[200px]"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  className="h-11 min-w-[110px] px-4"
                  onClick={handleCopy}
                  disabled={!canCopy}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-neutral-900/60 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <p className="text-sm font-medium text-white">Preview link</p>
                </div>
                {copied && (
                  <span className="text-xs font-semibold text-emerald-300">
                    Copied
                  </span>
                )}
              </div>
              <div className="rounded-lg border border-white/10 bg-neutral-950/60 p-3">
                <p className="font-mono text-[13px] break-all text-white">
                  {generatedUrl}
                </p>
              </div>
              {copyError && (
                <p className="text-sm text-red-300" role="alert">
                  {copyError}
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                Please share useful commands and be nice to each other.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
// AIGC END
