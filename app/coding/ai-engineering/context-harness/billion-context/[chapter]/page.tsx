import Link from "next/link";
import { ContextFoldChapter } from "@/components/context-fold-chapter";
import { notFound } from "next/navigation";
import {
  contextBase,
  lessons,
  sourceCommit,
  kernelCommit,
} from "@/lib/context-lessons";
import { ContextNotes } from "@/components/context-notes";
import { ContextLab } from "@/components/context-labs";
import { ContextChapterNav } from "@/components/context-chapter-nav";
import { ContextIllustration } from "@/components/context-illustrations";
import { ContextQuiz } from "@/components/context-quiz";
export function generateStaticParams() {
  return lessons.map((l) => ({ chapter: l.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const l = lessons.find((l) => l.slug === chapter);
  return { title: l ? `${l.title} — Context Harness` : "Chapter not found" };
}
export default async function Chapter({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const index = lessons.findIndex((l) => l.slug === chapter);
  if (index < 0) notFound();
  const lesson = lessons[index];
  const files =
    lesson.slug === "recovery"
      ? ["src/decompress-shared.ts", "src/compress-tool.ts", "CONFIGURATION.md", "paper/model-driven-incremental-hierarchical-compression-training-free-multi-generational-context-management-for-long-lived-coding-agents.md"]
      : lesson.slug === "incremental-fold" || lesson.slug === "fold"
      ? [
          "README.md",
          "paper/model-driven-incremental-hierarchical-compression-training-free-multi-generational-context-management-for-long-lived-coding-agents.md",
          "src/decompress-shared.ts",
          "src/compress-tool.ts",
          "src/acp-status.ts",
        ]
      : lesson.slug === "compression-doctrine" || lesson.slug === "growth-gate"
        ? ["src/config.ts", "src/session.ts", "src/compress-tool.ts"]
        : index === 0
          ? [
              "README.md",
              "reference/architecture.md",
              "src/decompress-shared.ts",
            ]
          : [
              "paper/model-driven-incremental-hierarchical-compression-training-free-multi-generational-context-management-for-long-lived-coding-agents.md",
              "src/compress-tool.ts",
            ];
  const commonSources = [
    [
      "LangChain · short-term memory",
      "https://docs.langchain.com/oss/python/langchain/short-term-memory",
    ],
    [
      "Claude · compaction",
      "https://platform.claude.com/docs/en/build-with-claude/compaction",
    ],
    [
      "Claude · context editing",
      "https://platform.claude.com/docs/en/build-with-claude/context-editing",
    ],
    [
      "LangChain · retrieval",
      "https://docs.langchain.com/oss/python/deepagents/retrieval",
    ],
    [
      "LangChain · long-term memory",
      "https://docs.langchain.com/oss/python/langchain/long-term-memory",
    ],
    [
      "Anthropic · context engineering",
      "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    ],
    [
      "OpenAI · session memory",
      "https://developers.openai.com/cookbook/examples/agents_sdk/session_memory",
    ],
  ];
  return (
    <main className="shell ch-page ch-lesson">
      <p className="ch-crumb">
        <Link href="/coding">Coding</Link> /{" "}
        <Link href="/coding/ai-engineering">AI Engineering</Link> /{" "}
        <Link href="/coding/ai-engineering/context-harness">
          Context Harness
        </Link>{" "}
        / <Link href={contextBase}>billion-context</Link>
      </p>
      <ContextChapterNav
        active={index}
        items={lessons.map((l) => ({
          title: l.title.replace(/^\d+\.\s*/, ""),
          href: `${contextBase}/${l.slug}`,
        }))}
      />
      <header className="ch-lesson-header">
        <p className="ch-kicker">
          {index === 0
            ? "READING MAP"
            : `CHAPTER ${String(index).padStart(2, "0")} / ${lessons.length - 1}`}{" "}
          · CONTEXT HARNESS
        </p>
        <h1>{lesson.title.replace(/^\d+\.\s*/, "")}</h1>
        <p className="ch-subtitle">{lesson.subtitle}</p>
        <p className="ch-lead">{lesson.intro}</p>
      </header>
      {lesson.slug === "fold" ? <ContextFoldChapter /> : <>
      <ContextIllustration slug={lesson.slug} />
      <ContextLab slug={lesson.slug} number={index} />
      <aside className="ch-clarification">
        <p className="ch-kicker">SOURCE CHECK / CONCEPTUAL BOUNDARY</p>
        <p>{lesson.clarification}</p>
      </aside>
      <section className="ch-note-section">
        <div className="ch-note-heading">
          <p className="ch-kicker">THE NOTEBOOK</p>
          <span>Concise learning notes · source-grounded mechanisms</span>
        </div>
        <ContextNotes text={lesson.notes} />
      </section>
      <ContextQuiz quiz={lesson.quiz} />
      </>}
      <section className="ch-source">
        <p className="ch-kicker">FOLLOW THE SOURCE</p>
        {lesson.slug === "basic-approaches" ? (
          <>
            <p>
              Common patterns checked against official provider and framework
              documentation. Examples illustrate mechanisms rather than
              market-share rankings.
            </p>
            {commonSources.map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer">
                {label} ↗
              </a>
            ))}
          </>
        ) : (
          <>
            <p>
              Reviewed source: <code>billion-context 0.1.180 / 03d27f9</code>.
              The notes are Lawson’s learning interpretation of the reviewed repository.
            </p>
            {lesson.slug === "hierarchical-compression" ||
            lesson.slug === "kernel" || lesson.slug === "recovery" ? (
              <a
                href={`https://github.com/ranxianglei/acp-kernel/tree/${kernelCommit}`}
                target="_blank"
                rel="noreferrer"
              >
                Pinned acp-kernel 0.0.100 · ranges, protections and lineage ↗
              </a>
            ) : null}
            {lesson.slug === "kernel" ? ["src/compress.ts", "src/protected.ts", "src/tool-pairs.ts", "src/hide-consumed.ts", "src/refs.ts"].map(file => <a key={file} href={`https://github.com/ranxianglei/acp-kernel/blob/${kernelCommit}/${file}`} target="_blank" rel="noreferrer">acp-kernel / {file} ↗</a>) : null}
            {lesson.slug === "recovery" ? <a href={`https://github.com/ranxianglei/acp-kernel/blob/${kernelCommit}/src/decompress.ts`} target="_blank" rel="noreferrer">acp-kernel / source collection and nested reads ↗</a> : null}
            {files.map((file) => (
              <a
                key={file}
                href={`https://github.com/ranxianglei/billion-context/blob/${sourceCommit}/${file}`}
                target="_blank"
                rel="noreferrer"
              >
                {file.startsWith("paper/")
                  ? "Living preprint · architecture and doctrine"
                  : file}{" "}
                ↗
              </a>
            ))}
          </>
        )}
      </section>
      <footer className="ch-pagination">
        {index > 0 ? (
          <Link href={`${contextBase}/${lessons[index - 1].slug}`}>
            <small>← PREVIOUS</small>
            {lessons[index - 1].title.replace(/^\d+\.\s*/, "")}
          </Link>
        ) : (
          <Link href={contextBase}>← Notebook overview</Link>
        )}
        {index < lessons.length - 1 ? (
          <Link href={`${contextBase}/${lessons[index + 1].slug}`}>
            <small>NEXT →</small>
            {lessons[index + 1].title.replace(/^\d+\.\s*/, "")}
          </Link>
        ) : (
          <Link href={contextBase}>Return to notebook →</Link>
        )}
      </footer>
    </main>
  );
}
