export const contextBase =
  "/coding/ai-engineering/context-harness/billion-context";
export const sourceCommit = "03d27f963a73c4bd761b877d567e575c5896d75b";
export const kernelCommit = "633b8c896c54340dec1d353eb8c14935e1c8f2a6";
export const interactiveChapters = [
  "long-context-problem",
  "fold",
  "hierarchical-compression",
  "growth-gate",
];
export const lessons = [
  {
    slug: "reference",
    title: "Textbook / Reference",
    subtitle: "Start with the source",
    intro:
      "Your learning notes are the starting point. This reading map connects concepts to the repository, its living preprint, and the current proxy implementation.",
    clarification:
      "Source review: billion-context 0.1.180 at 03d27f9 and its pinned acp-kernel 0.0.100. The labs are transparent, local teaching models; they do not call an LLM.",
    notes:
      "[ranxianglei/billion-context](https://github.com/ranxianglei/billion-context)",
    quiz: {
      question: "Where is the current decompression behavior best verified?",
      answers: [
        "The proxy source",
        "The project name",
        "A token-savings slogan",
      ],
      correct: 0,
      explanation:
        "Read src/decompress-shared.ts; the preprint describes the design, while the implementation records current behavior.",
    },
  },
  {
    slug: "active-context",
    title: "1. Basic idea of LLM context",
    subtitle: "What the model can actually see",
    intro:
      "A model answers from the input it receives on this request. A transcript stored elsewhere does not become active context until the harness includes or retrieves it.",
    clarification:
      "An application can implement persistent storage or memory. That infrastructure is distinct from the model retaining a conversation by itself.",
    notes:
      "An LLM itself does not inherently maintain long-term conversational memory.\n\n**Context** is the information available to the model during the current inference/request.\n\nTherefore:\n\n> **conversation history ≠ active context**\n\nA long conversation may contain much more information than what is currently placed inside the model's context window.\n\n---",
    quiz: {
      question:
        "An old message is saved on disk but absent from this request. Can the model directly attend to it?",
      answers: [
        "Yes, because it was said earlier",
        "Only after the harness includes or retrieves it",
        "Yes, if the conversation is long",
      ],
      correct: 1,
      explanation:
        "Saved history and active input are separate. Retrieval can bring the old content back into view.",
    },
  },
  {
    slug: "long-context-problem",
    title: "2. The long-context problem",
    subtitle: "A growing history, a finite workspace",
    intro:
      "Tool outputs and new turns enlarge the working set. Window capacity and a token budget constrain different things: how much fits on one request and how much repeated processing costs.",
    clarification:
      "The budget visualization uses invented token sizes and normalized costs. It does not estimate a provider’s bill.",
    notes:
      "There is a conflict between:\n\n- the user's token / monetary budget,\n- the model's limited context window,\n- **and** the continuously growing amount of information produced during a long-running agent session.\n\nAs the session grows:\n\n$$  \n\\text{conversation history} \\uparrow  \n\\quad \\Rightarrow \\quad  \n\\text{input tokens} \\uparrow  \n$$\n\nEventually, this can increase cost or exceed the model's context-window limit.\n\n---",
    quiz: {
      question: "What does a context window limit constrain?",
      answers: [
        "All tokens billed over a month",
        "The size of one request’s context",
        "The number of stored files",
      ],
      correct: 1,
      explanation:
        "A window bounds the resident input on a request. Cumulative billing is a different quantity.",
    },
  },
  {
    slug: "bounded-window",
    title: "3. Core idea",
    subtitle: "Cumulative work is not resident context",
    intro:
      "The name billion-context describes cumulative processing over a long session. It does not mean the model attends to one billion tokens in a single forward pass.",
    clarification:
      "Cumulative input counts input processed across requests, including repeated history. It is neither unique stored text nor one simultaneous attention window.",
    notes:
      "The key idea is **not** to create a model with a native billion-token attention window.\n\nInstead:\n\n$$  \n\\text{very long cumulative session}  \n\\rightarrow  \n\\text{context management}  \n\\rightarrow  \n\\text{limited active context}  \n\\rightarrow  \n\\text{LLM}  \n$$\n\nSo a session may process billions of cumulative tokens over time while only a much smaller amount of information remains resident in the model's active context at any one moment.\n\nIn short:\n\n> **Keep recent information verbatim, fold older information into recoverable summaries, and retrieve historical details only when they become relevant again.**\n\n---",
    quiz: {
      question:
        "Does one billion cumulative input tokens imply a billion-token attention window?",
      answers: ["Yes", "No"],
      correct: 1,
      explanation:
        "Many smaller requests can sum to billions of tokens, including repeated prefix reads.",
    },
  },
  {
    slug: "basic-approaches",
    title: "4. Basic approaches",
    subtitle: "The common context-management toolkit",
    intro:
      "Most agent systems combine several methods: keep a recent window, compact older turns, prune noisy outputs, retrieve relevant sources, persist useful state, and isolate focused tasks. Each changes a different part of what reaches the model.",
    clarification:
      "These are recurring patterns in official framework and provider documentation, not a market-share ranking. Trimming the model input does not imply deleting the archive. Summaries, retained originals and retrieval can coexist.",
    notes:
      "### The practical starting point\n\nAsk two separate questions: **what should be visible on this request?** and **what should remain stored for later?** A database can retain the entire transcript while a request contains only a small working set.\n\nThe methods below are complementary. The same application can use a recent window, a summary, retrieved evidence and persistent notes together.\n\n### 1. Sliding window / history trimming\n\nKeep the last few turns or a token-limited suffix, alongside essential instructions. Treat a tool call and its result as a valid unit; cutting through the middle of that exchange can produce an invalid message sequence.\n\n**Useful for:** short support exchanges and local conversational continuity. **Tradeoff:** an older constraint may leave the working view even when it still matters. Store or pin critical state separately.\n\n[Examples: LangChain short-term memory](https://docs.langchain.com/oss/python/langchain/short-term-memory) · [OpenAI Agents SDK session-memory cookbook](https://developers.openai.com/cookbook/examples/agents_sdk/session_memory)\n\n### 2. Summarization / compaction\n\nReplace older turns with a shorter account of goals, decisions, unresolved problems and progress; retain recent turns verbatim when useful. Compaction can be triggered by a token threshold, requested explicitly, or run in the background. Its scope depends on the implementation.\n\n**Useful for:** maintaining continuity through a long task. **Tradeoff:** a summary can omit exact details, and repeated rewriting can introduce drift. Saving the original transcript provides a separate recovery path; the summary itself is not an inverse encoding.\n\n[Example: Claude compaction overview](https://platform.claude.com/docs/en/build-with-claude/compaction)\n\n### 3. Selective pruning / tool-result clearing\n\nRemove or shorten specific low-value content: stale file dumps, duplicate reads and already-consumed logs. Keep recent or protected results. This targets noisy items rather than necessarily summarizing the whole conversation.\n\n**Useful for:** tool-heavy coding and research. **Tradeoff:** a result that seems stale can become relevant again. Preserve artifacts or allow re-reading.\n\n[Example: Claude context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)\n\n### 4. Retrieval / RAG / just-in-time loading\n\nKeep documents or historical records outside the prompt. At query time, select relevant passages through keyword search, semantic search, database queries or file tools and insert them into the working context. RAG combines retrieval with generation; a vector database is one implementation option.\n\n**Useful for:** large document collections and occasional exact lookups. **Tradeoff:** an answer depends on finding the right evidence. Chunking, ranking and query quality affect what is found; a search miss is not proof that the source lacks the information.\n\n[Example: LangChain retrieval](https://docs.langchain.com/oss/python/deepagents/retrieval)\n\n### 5. Structured memory / persistent notes\n\nWrite durable facts and project state into explicit records: user preferences, constraints, decisions, TODOs and artifact paths. Load selected records when needed. Unlike a chronological transcript, these records organize what the task should remember.\n\n**Useful for:** returning to a project or carrying state across sessions. **Tradeoff:** extraction can miss details; outdated notes need updating. Keeping a fact does not automatically keep the evidence or conversation that produced it.\n\n[Example: LangChain long-term memory](https://docs.langchain.com/oss/python/langchain/long-term-memory)\n\n### 6. Context isolation / subagents\n\nGive a focused task its own context and return a concise finding plus source references to the coordinating agent. The exploratory trace stays outside the coordinator’s working view.\n\n**Useful for:** separable research or code investigations. **Tradeoff:** coordination and extra model calls add work, and a handoff may omit assumptions. Isolation can reduce the main agent’s context without reducing total system token usage.\n\n[Example: Anthropic context-engineering guide](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)\n\n### Compare the mechanisms\n\n| Method | What changes in the working view? | What needs separate care? |\n| --- | --- | --- |\n| Sliding window | Only a recent suffix stays visible | Older constraints |\n| Compaction | Older turns become a summary | Exact details and summary drift |\n| Selective pruning | Chosen outputs disappear or shrink | Later re-reading |\n| Retrieval | Relevant stored passages enter on demand | Search coverage and source retention |\n| Structured memory | Selected durable state is loaded | Freshness and provenance |\n| Context isolation | Detailed exploration moves to another agent | Handoff quality and coordination cost |\n\n### A combined design\n\n**Instructions + durable state + summary + recent turns + retrieved evidence** can all contribute to one request. Their combined size still has to fit the model’s input budget.\n\nA larger context window provides capacity. Capacity alone does not choose which information deserves the space. The next chapter examines billion-context’s particular combination of these familiar ideas.\n",
    quiz: {
      question:
        "A summary omits an exact test value. What determines whether the agent can recover it later?",
      answers: [
        "The summary is shorter",
        "The original source is retained and accessible through a recovery path",
        "The application used compaction instead of trimming",
      ],
      correct: 1,
      explanation:
        "Recovery is a storage-and-access property. Trimming and summarization can both coexist with a retained archive and retrieval.",
    },
  },
  {
    slug: "incremental-fold",
    title: "5. The billion-context approach",
    subtitle: "What distinguishes this particular combination?",
    intro:
      "billion-context combines familiar compression and retrieval ideas into a model-directed, incremental hierarchy of addressable digest blocks. Its design difference is the coordination of those parts across a long-running session.",
    clarification:
      "This is a design comparison, not proof of universal superiority or exclusive invention. Modern compaction systems may retain originals, keep recent turns, and use model judgment too. Here, a “rolling summary” means the specific baseline illustrated in the lab, not every commercial implementation.",
    notes:
      "### The design combination\n\nbillion-context uses familiar tools—summarization, protected recent context and source reads—inside an addressable block structure. The working model selects consumed ranges and writes digests; acp-kernel tracks references, enforces protections and renders the resulting view.\n\n| Design choice | What it changes |\n| --- | --- |\n| Local folds | A new range gets its own digest; unrelated blocks can stay unchanged |\n| Higher-tier distillation | Older digests can themselves become a smaller parent |\n| Source lineage | Block IDs connect summaries to their retained originals |\n| Model judgment + doctrine | The model evaluates task need, scope and timing |\n| Growth-gated nudges | The kernel asks for evaluation after growth; a normal nudge can be deferred |\n\n### Incremental does not mean immutable\n\nA local fold of a new range does not require rewriting the entire accumulated account. This limits routine rewrite scope. Later higher-tier distillation can re-summarize selected old blocks. Inline-recovered blocks may also be refolded in place.\n\n### Recovery is part of the working loop\n\n`acp_status` reports composition and candidate ranges. `compress` creates digests. `search_context` helps locate candidates. `decompress` reads their sources.\n\nIn the current proxy, recovery returns a historical copy or file pointer while the digest remains folded. Search is not an exhaustive scan of every hidden original; exact recovery depends on source retention and access.\n\n### Keep the comparison fair\n\nThese ingredients are not individually unique to billion-context. Modern compaction can keep recent context and originals; RAG can return exact sources; other memory systems use hierarchical pointers and model-driven management. Here the distinguishing subject is how **local blocks, generations, task judgment and recovery compose within a long-lived session**.\n\nThe repository’s deployment results describe its workloads and configurations. They do not establish a universal advantage over every other context-management system. The next chapter isolates the single fold operation before adding hierarchy.\n",
    quiz: {
      question:
        "What best describes billion-context’s difference from the common toolkit?",
      answers: [
        "It alone can summarize and retrieve information",
        "It coordinates model-selected local folds, tiered blocks, lineage and recovery within the session",
        "It makes the model attend to a billion tokens at once",
      ],
      correct: 1,
      explanation:
        "Summarization, retrieval and retained sources are shared ideas. The distinction is how this design coordinates them; it is not a claim of exclusive capability or a larger native attention window.",
    },
  },
  {
    slug: "fold",
    title: "6. Fold",
    subtitle: "Less in view. Still within reach.",
    intro:
      "A fold replaces a consumed range with a digest and source links. Explore what becomes smaller, what survives, and how an omitted detail returns.",
    clarification:
      "The current proxy returns copies or file pointers while keeping the block folded. This differs from the preprint’s general source-reactivation description. Exact recovery requires retained sources; a summary alone is lossy.",
    notes:
      "### A fold is more than a summary\n\nThe model writes the digest. The kernel manages its identity, coverage, visibility and lineage.\n\n$$\n\\text{fold}=\\text{digest}+\\text{source links}+\\text{working-view change}\n$$\n\n| Working view | Source store |\n| --- | --- |\n| Addressable digest + recent raw messages | Retained original messages |\n| Enough meaning to continue the task | Exact text to inspect when needed |\n\n**Consumed ≠ old.** Fold details the current step has finished using. Preserve decisions with rationale, exact errors, artifact paths and useful conclusions. Structural protections cannot judge whether a summary kept the right meaning.\n\n### Recovery is a read, not an inverse\n\nIn the current proxy, `decompress` returns source content without removing the digest. For a higher-tier block, the default returns one level (including child digests); `full: true` walks to original messages. Inline whole-block recovery also marks the block for possible later refolding in place.\n\n`toFile` returns a path. Source text enters the working view only when a read returns it. Large inline results can automatically become file pointers. A message subrange requires CCR (the retained-content store); it is not available in every integration.\n\n### Search has a blind spot\n\n`search_context` finds candidate blocks from indexed summary/topic text. An omitted keyword can miss even when it exists in the originals. Keep useful identifiers in the digest; use known refs and accessible sources when search is insufficient.\n\nSeveral local folds can coexist. When their digests themselves accumulate, the next chapter folds those blocks into higher tiers while preserving source lineage.\n",
    quiz: {
      question:
        "A digest omitted an exact timeout. Where can that value come from?",
      answers: [
        "The digest can be decompressed like a ZIP file",
        "A read of the retained original source",
        "A smaller summary guarantees it survives",
      ],
      correct: 1,
      explanation:
        "The source links enable retrieval. The summary does not encode every original detail.",
    },
  },
  {
    slug: "hierarchical-compression",
    title: "7. Hierarchical Compression",
    subtitle: "Across time. Up through tiers.",
    intro:
      "Summaries accumulate too. Fold selected older blocks into a higher tier while retaining links to their children and original messages.",
    clarification:
      "Tier diagrams are conceptual. The source paper describes directBlockIds and effectiveMessageIds; the current proxy uses stored originals for recovery. Higher-tier summaries can omit detail even while the source remains recoverable.",
    notes:
      "### Two directions\n\n**Across time:** each consumed message range can become its own tier-1 block. Creating a new block does not require rewriting every older block.\n\n**Across tiers:** selected digests become a more distilled parent. Tier 2 folds tier-1 blocks; tier 3 folds tier-2 blocks. The selected children become inactive in the working view but remain in the lineage graph.\n\n$$\n\\text{raw messages}\\rightarrow T_1\\rightarrow T_2\\rightarrow T_3\n$$\n\n### Direct children versus original coverage\n\n| Field | Meaning |\n| --- | --- |\n| `directMessageIds` | Raw messages consumed directly |\n| `directBlockIds` | Child blocks consumed directly |\n| `effectiveMessageIds` | All original messages covered transitively |\n| `active` | Whether the block is rendered into the working view |\n\nA parent points to its children, which point to their sources. **One-level recovery** returns child digests; **full recovery** follows the graph to the retained original messages. Higher tiers contain less detail, so provenance and source access matter more.\n\nLineage makes exact recovery possible when the originals are retained and accessible. It does not make the digest itself lossless or guarantee that the model will choose to retrieve.\n",
    quiz: {
      question: "Folding S1 and S2 into a tier-2 digest is which direction?",
      answers: ["Horizontal incrementality", "Vertical hierarchy"],
      correct: 1,
      explanation:
        "Horizontal handles new ranges across time. Vertical re-distills digests across tiers.",
    },
  },
  {
    slug: "compression-doctrine",
    title: "8. Compression Doctrine",
    subtitle: "Semantic judgment meets structural safeguards",
    intro:
      "The model uses task meaning to choose useful summaries. The kernel supplies stable references, protected ranges, visibility rules and budget enforcement.",
    clarification:
      "Age and relevance are teaching heuristics, not an implemented numerical scoring function. Kernel protections can reject a proposed range. Recent-tool exclusions and protected tool settings are configurable.",
    notes:
      "### A specification of judgment\n\nThe **Compression Doctrine** is the instruction set guiding the model’s decisions about timing, scope and summary fidelity. The kernel provides the mechanics; the doctrine guides the meaning.\n\n$$\n\\text{context management}=\\text{structural execution}+\\text{semantic judgment}\n$$\n\n### Consumed is a task-relative judgment\n\nA verbose test log can be consumed once its outcome is extracted. An old unresolved error can still be active. Age and size help locate candidates, but they do not decide whether details remain necessary.\n\n**Keep:** user intent, constraints, decisions with rationale, unresolved questions, exact errors, artifact paths and load-bearing values.\n\n**Fold:** repetitive output, duplicate reads, completed exploration and dead ends whose lessons have already been extracted. Preserve their useful conclusion and enough description to locate their sources later.\n\n### Two ways to fail\n\nUnder-compression crowds the working view. Over-compression removes meaning needed for the next step. A shorter digest is not automatically better; source recovery remains a separate safeguard.\n\n### Distinguish a recommendation from enforcement\n\nThe model can defer a normal nudge while active debugging still needs the detail. The kernel separately enforces protected zones, tool/turn integrity and valid block bookkeeping. It cannot certify that the model-written digest preserves the right meaning.\n\nThe Fold workbench lets you compare a faithful digest with an over-compressed one and inspect the consequence for an exact question.\n",
    quiz: {
      question:
        "An old message is still essential to the current debugging step. What should semantic judgment favor?",
      answers: ["Compress because it is old", "Preserve it for now"],
      correct: 1,
      explanation:
        "The criterion is current task need. Age alone is insufficient.",
    },
  },
  {
    slug: "growth-gate",
    title: "9. Growth Gate",
    subtitle: "When to ask is not what to compress",
    intro:
      "The normal gate decides when to ask the model to evaluate compression. The model still decides what is consumed; the kernel validates the resulting operation.",
    clarification:
      "The normal path uses a context floor and growth checks. The pinned kernel’s default growth interval is 50K, with additional compressible-mass and tier gates. The lab isolates the floor + growth relationship; emergency handling is separate.",
    notes:
      "### Separate the responsibilities\n\n| Kernel / gate | Model + doctrine |\n| --- | --- |\n| Track context growth and candidate ranges | Judge whether the current step still needs the detail |\n| Ask for an evaluation | Fold a consumed range, defer, or initiate a fold |\n| Validate and execute the chosen operation | Write the digest’s useful meaning |\n\nThe normal path combines a context floor with growth since the last compression. The pinned kernel uses a 50K growth interval, with a lower effective requirement when pending compressible mass is small, plus tier-specific checks.\n\n**A nudge is not an overflow warning and not a command to compress everything.** The model may defer during active debugging. After a successful fold, the gate updates its baseline; emergency budget handling is a separate path.\n",
    quiz: {
      question:
        "A nudge fires in the middle of a critical task. Must the model compress?",
      answers: [
        "Yes, the gate chooses the range",
        "No, it can refuse and continue",
      ],
      correct: 1,
      explanation:
        "The gate invites evaluation. The model retains semantic choice; hard budget backstops are separate.",
    },
  },
];
