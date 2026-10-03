export const contextBase = "/coding/ai-engineering/context-harness/billion-context";
export const sourceCommit = "f2b180227d617e688a2a26113a638cf244fee018";
export const lessons = [
  {
    "slug": "reference",
    "title": "Textbook / Reference",
    "subtitle": "Start with the source",
    "intro": "Your learning notes are the starting point. This reading map connects concepts to the repository, its living preprint, and the current proxy implementation.",
    "clarification": "Examples on these pages are local teaching simulations, not a live proxy or measured performance benchmark. The reviewed source is pinned to commit f2b1802 (billion-context 0.1.180).",
    "notes": "[ranxianglei/billion-context](https://github.com/ranxianglei/billion-context)",
    "quiz": {
      "question": "Where is the current decompression behavior best verified?",
      "answers": [
        "The proxy source",
        "The project name",
        "A token-savings slogan"
      ],
      "correct": 0,
      "explanation": "Read src/decompress-shared.ts; the preprint describes the design, while the implementation records current behavior."
    },
    "labId": 0
  },
  {
    "slug": "active-context",
    "title": "1. Basic idea of LLM context",
    "subtitle": "What the model can actually see",
    "intro": "A model answers from the input it receives on this request. A transcript stored elsewhere does not become active context until the harness includes or retrieves it.",
    "clarification": "An application can implement persistent storage or memory. That infrastructure is distinct from the model retaining a conversation by itself.",
    "notes": "An LLM itself does not inherently maintain long-term conversational memory.\n\n**Context** is the information available to the model during the current inference/request.\n\nTherefore:\n\n> **conversation history ≠ active context**\n\nA long conversation may contain much more information than what is currently placed inside the model's context window.\n\n---",
    "quiz": {
      "question": "An old message is saved on disk but absent from this request. Can the model directly attend to it?",
      "answers": [
        "Yes, because it was said earlier",
        "Only after the harness includes or retrieves it",
        "Yes, if the conversation is long"
      ],
      "correct": 1,
      "explanation": "Saved history and active input are separate. Retrieval can bring the old content back into view."
    },
    "labId": 1
  },
  {
    "slug": "long-context-problem",
    "title": "2. The long-context problem",
    "subtitle": "A growing history, a finite workspace",
    "intro": "Tool outputs and new turns enlarge the working set. Window capacity and a token budget constrain different things: how much fits on one request and how much repeated processing costs.",
    "clarification": "The budget visualization uses invented token sizes and normalized costs. It does not estimate a provider’s bill.",
    "notes": "There is a conflict between:\n\n- the user's token / monetary budget,\n- the model's limited context window,\n- **and** the continuously growing amount of information produced during a long-running agent session.\n\nAs the session grows:\n\n$$  \n\\text{conversation history} \\uparrow  \n\\quad \\Rightarrow \\quad  \n\\text{input tokens} \\uparrow  \n$$\n\nEventually, this can increase cost or exceed the model's context-window limit.\n\n---",
    "quiz": {
      "question": "What does a context window limit constrain?",
      "answers": [
        "All tokens billed over a month",
        "The size of one request’s context",
        "The number of stored files"
      ],
      "correct": 1,
      "explanation": "A window bounds the resident input on a request. Cumulative billing is a different quantity."
    },
    "labId": 2
  },
  {
    "slug": "bounded-window",
    "title": "3. Core idea",
    "subtitle": "Cumulative work is not resident context",
    "intro": "The name billion-context describes cumulative processing over a long session. It does not mean the model attends to one billion tokens in a single forward pass.",
    "clarification": "Cumulative input may count the same prefix again on many requests, including cache reads. It is not the number of unique tokens stored or attended to simultaneously.",
    "notes": "The key idea is **not** to create a model with a native billion-token attention window.\n\nInstead:\n\n$$  \n\\text{very long cumulative session}  \n\\rightarrow  \n\\text{context management}  \n\\rightarrow  \n\\text{limited active context}  \n\\rightarrow  \n\\text{LLM}  \n$$\n\nSo a session may process billions of cumulative tokens over time while only a much smaller amount of information remains resident in the model's active context at any one moment.\n\nIn short:\n\n> **Keep recent information verbatim, fold older information into recoverable summaries, and retrieve historical details only when they become relevant again.**\n\n---",
    "quiz": {
      "question": "Does one billion cumulative input tokens imply a billion-token attention window?",
      "answers": [
        "Yes",
        "No"
      ],
      "correct": 1,
      "explanation": "Many smaller requests can sum to billions of tokens, including repeated prefix reads."
    },
    "labId": 5
  },
  {
    "slug": "basic-approaches",
    "title": "4. Basic approaches",
    "subtitle": "The common context-management toolkit",
    "intro": "Most agent systems combine several methods: keep a recent window, compact older turns, prune noisy outputs, retrieve relevant sources, persist useful state, and isolate focused tasks. Each changes a different part of what reaches the model.",
    "clarification": "These are recurring patterns in official framework and provider documentation, not a market-share ranking. Trimming the model input does not imply deleting the archive. Summaries, retained originals and retrieval can coexist.",
    "notes": "### The practical starting point\n\nAsk two separate questions: **what should be visible on this request?** and **what should remain stored for later?** A database can retain the entire transcript while a request contains only a small working set.\n\nThe methods below are complementary. The same application can use a recent window, a summary, retrieved evidence and persistent notes together.\n\n### 1. Sliding window / history trimming\n\nKeep the last few turns or a token-limited suffix, alongside essential instructions. Treat a tool call and its result as a valid unit; cutting through the middle of that exchange can produce an invalid message sequence.\n\n**Useful for:** short support exchanges and local conversational continuity. **Tradeoff:** an older constraint may leave the working view even when it still matters. Store or pin critical state separately.\n\n[Examples: LangChain short-term memory](https://docs.langchain.com/oss/python/langchain/short-term-memory) · [OpenAI Agents SDK session-memory cookbook](https://developers.openai.com/cookbook/examples/agents_sdk/session_memory)\n\n### 2. Summarization / compaction\n\nReplace older turns with a shorter account of goals, decisions, unresolved problems and progress; retain recent turns verbatim when useful. Compaction can be triggered by a token threshold, requested explicitly, or run in the background. Its scope depends on the implementation.\n\n**Useful for:** maintaining continuity through a long task. **Tradeoff:** a summary can omit exact details, and repeated rewriting can introduce drift. Saving the original transcript provides a separate recovery path; the summary itself is not an inverse encoding.\n\n[Example: Claude compaction overview](https://platform.claude.com/docs/en/build-with-claude/compaction)\n\n### 3. Selective pruning / tool-result clearing\n\nRemove or shorten specific low-value content: stale file dumps, duplicate reads and already-consumed logs. Keep recent or protected results. This targets noisy items rather than necessarily summarizing the whole conversation.\n\n**Useful for:** tool-heavy coding and research. **Tradeoff:** a result that seems stale can become relevant again. Preserve artifacts or allow re-reading. Clearing early content may also reduce prefix-cache reuse.\n\n[Example: Claude context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)\n\n### 4. Retrieval / RAG / just-in-time loading\n\nKeep documents or historical records outside the prompt. At query time, select relevant passages through keyword search, semantic search, database queries or file tools and insert them into the working context. RAG combines retrieval with generation; a vector database is one implementation option.\n\n**Useful for:** large document collections and occasional exact lookups. **Tradeoff:** an answer depends on finding the right evidence. Chunking, ranking and query quality affect what is found; a search miss is not proof that the source lacks the information.\n\n[Example: LangChain retrieval](https://docs.langchain.com/oss/python/deepagents/retrieval)\n\n### 5. Structured memory / persistent notes\n\nWrite durable facts and project state into explicit records: user preferences, constraints, decisions, TODOs and artifact paths. Load selected records when needed. Unlike a chronological transcript, these records organize what the task should remember.\n\n**Useful for:** returning to a project or carrying state across sessions. **Tradeoff:** extraction can miss details; outdated notes need updating. Keeping a fact does not automatically keep the evidence or conversation that produced it.\n\n[Example: LangChain long-term memory](https://docs.langchain.com/oss/python/langchain/long-term-memory)\n\n### 6. Context isolation / subagents\n\nGive a focused task its own context and return a concise finding plus source references to the coordinating agent. The exploratory trace stays outside the coordinator’s working view.\n\n**Useful for:** separable research or code investigations. **Tradeoff:** coordination and extra model calls add work, and a handoff may omit assumptions. Isolation can reduce the main agent’s context without reducing total system token usage.\n\n[Example: Anthropic context-engineering guide](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)\n\n### Compare the mechanisms\n\n| Method | What changes in the working view? | What needs separate care? |\n| --- | --- | --- |\n| Sliding window | Only a recent suffix stays visible | Older constraints |\n| Compaction | Older turns become a summary | Exact details and summary drift |\n| Selective pruning | Chosen outputs disappear or shrink | Later re-reading and cache changes |\n| Retrieval | Relevant stored passages enter on demand | Search coverage and source retention |\n| Structured memory | Selected durable state is loaded | Freshness and provenance |\n| Context isolation | Detailed exploration moves to another agent | Handoff quality and coordination cost |\n\n### A combined design\n\n**Instructions + durable state + summary + recent turns + retrieved evidence** can all contribute to one request. Their combined size still has to fit the model’s input budget.\n\nA larger context window provides capacity. Prompt caching can reduce repeated prefix processing. Neither chooses which information deserves the space. The next chapter examines billion-context’s particular combination of these familiar ideas.\n",
    "quiz": {
      "question": "A summary omits an exact test value. What determines whether the agent can recover it later?",
      "answers": [
        "The summary is shorter",
        "The original source is retained and accessible through a recovery path",
        "The application used compaction instead of trimming"
      ],
      "correct": 1,
      "explanation": "Recovery is a storage-and-access property. Trimming and summarization can both coexist with a retained archive and retrieval."
    },
    "labId": 3
  },
  {
    "slug": "incremental-fold",
    "title": "5. The billion-context approach",
    "subtitle": "What distinguishes this particular combination?",
    "intro": "billion-context combines familiar compression and retrieval ideas into a model-directed, incremental hierarchy of addressable digest blocks. Its design difference is the coordination of those parts across a long-running session.",
    "clarification": "This is a design comparison, not proof of universal superiority or exclusive invention. Modern compaction systems may retain originals, keep recent turns, and use model judgment too. Here, a “rolling summary” means the specific baseline illustrated in the lab, not every commercial implementation.",
    "notes": "### Start from the common toolkit\n\nbillion-context still writes summaries, keeps recent context and retrieves history. It is a context-management layer around an agent’s requests, using acp-kernel for bookkeeping and folding. It does not increase the model’s native attention window or train a new model.\n\nThe distinctive design is a **combination**: selected ranges become individually addressable digest blocks; blocks can be folded into higher tiers; retained sources remain reachable; and the working model participates in context-management decisions.\n\n[Source: README, “How it works”](https://github.com/ranxianglei/billion-context/blob/f2b180227d617e688a2a26113a638cf244fee018/README.md)\n\n### 1. Local folds instead of routinely rewriting one rolling summary\n\nA rolling-summary baseline can repeatedly combine the previous summary with newly accumulated turns. In billion-context, a normal fold targets a selected consumed range. Other digest blocks can remain unchanged, and recent working messages remain raw.\n\nFor example, one consumed range produces **b01**; a later range produces **b02**. Creating b02 does not inherently require rewriting b01. This limits the scope of each rewrite. Higher-tier compression can later re-distill old blocks, so “incremental” does not mean a summary can never change again.\n\n### 2. A hierarchy manages the summaries themselves\n\nFlat summaries also accumulate. The design therefore supports raw messages → tier-1 blocks → higher-tier blocks. Each higher-tier digest keeps references to its children and original message coverage.\n\nThis combines bounded working context with progressively coarser history. It differs from using only a fixed recent suffix or one ever-growing summary. Tiering alone is not unique to this project; the later Hierarchical Compression chapter explains its specific layout.\n\n[Source: living preprint §3.2 and §3.6](https://github.com/ranxianglei/billion-context/blob/f2b180227d617e688a2a26113a638cf244fee018/paper/model-driven-incremental-hierarchical-compression-training-free-multi-generational-context-management-for-long-lived-coding-agents.md)\n\n### 3. Recoverable blocks connect meaning to exact sources\n\nStable message references and block lineage connect a digest to the range it represents. The model can use search_context to locate candidates, then decompress a relevant block when its summary lacks the needed detail.\n\n**Recovery reads retained source data; it does not reconstruct lost text from a summary.** In the reviewed proxy, keyword search covers digests and visible messages. It is not an exhaustive semantic search over every hidden raw token. Retained originals and a usable retrieval path remain necessary.\n\nA conventional RAG system can also retrieve exact originals. billion-context specifically integrates this access with the conversation’s folded block structure, rather than treating document retrieval as a separate knowledge-base feature.\n\n### 4. The model judges task need; the kernel enforces structure\n\nThresholds and growth checks can prompt evaluation. The model uses the compression doctrine to decide whether a range is consumed and what meaning to preserve; in the normal nudge flow, it can defer compression or initiate it itself.\n\nThe kernel validates ranges, protects designated zones, tracks blocks and renders the working view. **A normal nudge is not a command to compact everything.** Emergency budget handling is a separate path.\n\nMany summarizers also use an LLM to write a summary. Here, model participation additionally covers selecting ranges and judging timing within the kernel’s constraints. The Doctrine and Growth Gate chapters expand that distinction.\n\n[Source: living preprint §3.3–3.7 and §4](https://github.com/ranxianglei/billion-context/blob/f2b180227d617e688a2a26113a638cf244fee018/paper/model-driven-incremental-hierarchical-compression-training-free-multi-generational-context-management-for-long-lived-coding-agents.md)\n\n### 5. Recovery can leave the folded view intact\n\nIn the current proxy, decompress normally returns a historical copy or a file pointer while the block stays folded. File output lets the agent inspect selected content without inserting the whole recovered range into the request immediately. Inline copies add temporary input.\n\nThis avoids requiring a permanent expand-and-refold cycle for every lookup. The inline whole-block path also records a sidecar flag for later handling. The proxy behavior is more specific than the preprint’s general description of reactivating sources.\n\n[Source: resolveDecompress in src/decompress-shared.ts](https://github.com/ranxianglei/billion-context/blob/f2b180227d617e688a2a26113a638cf244fee018/src/decompress-shared.ts)\n\n### 6. Cache behavior is part of the design\n\nThe layout and rendering aim to avoid unnecessary rewrites of established context, and file-based recovery avoids automatically inflating the prompt. These choices can preserve more opportunities for prefix reuse than broadly rewriting early history.\n\nAn actual cache hit still requires an unchanged token prefix and compatible provider behavior. A changed early token affects the suffix; timeouts, model switches and routing can also affect reuse. “Cache friendly” is a design goal, not a guarantee of a particular hit rate.\n\n### Compare without oversimplifying the alternatives\n\n| Common pattern | billion-context’s design emphasis | What is shared or conditional? |\n| --- | --- | --- |\n| Recent-window trimming | Digest blocks plus protected recent working context | Either system can keep an archive |\n| Rolling compaction | Selected local folds, then higher-tier distillation | Compaction can also retain recent turns and originals |\n| Tool-result pruning | Model-written digests of consumed ranges | Both can remove noisy results from active input |\n| RAG / history retrieval | Search and recovery tied to block IDs and lineage | Both depend on stored sources and finding the right range |\n| Structured memory | Task-state guidance plus traceable conversation blocks | Both can preserve decisions and project state |\n| Context isolation | Manages the evolving session’s working view | Isolation can coexist; it solves a different scope problem |\n\n### Try the workflow\n\n1. Use acp_status to inspect context usage and compressible ranges.\n2. Call compress on a consumed range, preserving decisions and useful identifiers.\n3. Keep working with its digest and recent verbatim messages.\n4. Use search_context, then decompress when an exact historical detail matters.\n\nThe adjacent labs illustrate rewrite scope and source recovery. They are not benchmarks. The source repository’s deployment results describe its workloads and configurations; they do not establish a universal advantage over every modern compaction or memory system.\n",
    "quiz": {
      "question": "What best describes billion-context’s difference from the common toolkit?",
      "answers": [
        "It alone can summarize and retrieve information",
        "It coordinates model-selected local folds, tiered blocks, lineage and recovery within the session",
        "It makes the model attend to a billion tokens at once"
      ],
      "correct": 1,
      "explanation": "Summarization, retrieval and retained sources are shared ideas. The distinction is how this design coordinates them; it is not a claim of exclusive capability or a larger native attention window."
    },
    "labId": 4
  },
  {
    "slug": "prefix-cache",
    "title": "6. Prefix Cache and Cache Hit Rate",
    "subtitle": "Change one token. Watch reuse disappear.",
    "intro": "Cross-request prefix reuse depends on an exact common beginning. Once a token changes, the unchanged tokens after it no longer belong to that shared prefix.",
    "clarification": "A stable prefix creates an opportunity for reuse, not a guarantee. Cache lifetime, provider support, model changes and cache routing also matter. Folding does not magically preserve every changed token: location and rendering determine the affected suffix.",
    "notes": "### Prefix\n\nIn the context of an LLM, a **prefix** is a continuous sequence of tokens starting from the beginning of the input.\n\nFor example:\n\n$$  \nX=[x_1,x_2,x_3,\\ldots,x_n]  \n$$\n\nA prefix of length $k$ is:\n\n$$  \nP_k=[x_1,x_2,\\ldots,x_k]  \n$$\n\nIf two consecutive requests begin with the same tokens, they share a **common prefix**.\n\n---\n\n### Prefix Cache\n\nA **prefix cache** stores reusable intermediate computational results produced when the model processes input tokens in a prefix.\n\nFor example:\n\n$$  \n\\text{Request}_1=[A,B,C,D]  \n$$\n\nand later:\n\n$$  \n\\text{Request}_2=[A,B,C,D,E,F]  \n$$\n\nThe prefix\n\n$$  \n[A,B,C,D]  \n$$\n\nhas already been processed.\n\nInstead of recomputing the entire sequence, the system may reuse the cached computation associated with this unchanged prefix and mainly process the newly added part:\n\n$$  \n[A,B,C,D]_{\\text{cached}}+[E,F]_{\\text{new}}  \n$$\n\nTherefore, the main purpose of prefix caching is:\n\n> **Avoid repeatedly computing an unchanged prefix across requests.**\n\n---\n\n### Cache Hit Rate\n\n$\\text{Cache Hit Rate} = \\frac{\\text{prefix tokens reused successfully}} {\\text{relative input tokens}}$\n\nA higher cache hit rate means that a larger proportion of previous computation can be reused.\n\nTherefore:\n\n$$  \n\\text{Higher Cache Hit Rate}  \n\\Rightarrow  \n\\text{More Computation Reused}  \n\\Rightarrow  \n\\text{Lower Effective Inference Cost}  \n$$\n\n### Prefix Stability\n\nPrefix caching works best when the beginning of the context remains unchanged.\n\nFor example:\n\n```\nRequest 1:\n[A B C D E]\n\nRequest 2:\n[A B C D E | F G]\n └─────────┘\n shared prefix\n```\n\nHowever, if an early part changes:\n\n```\nRequest 1:\n[A B C D E]\n\nRequest 2:\n[A B X D E]\n     ↑\n   changed\n```\n\nthe common prefix ends at:\n\n```\n[A B]\n```\n\nTherefore, repeatedly rewriting old context can reduce prefix-cache reuse.\n\n### Why this matters for billion-context\n\n`billion-context` emphasizes three related properties:\n\n- **Incremental:** use local folds instead of repeatedly rewriting the whole conversation history.\n- **Reversible:** compressed historical context can be recovered when necessary.\n- **Prefix-cache friendly:** keep as much of the existing prefix stable as possible so previous computation can continue to be reused.\n\n---",
    "quiz": {
      "question": "If Request 2 is A B X D E, how much of A B C D E is an exact shared prefix?",
      "answers": [
        "A B",
        "A B D E",
        "All five tokens"
      ],
      "correct": 0,
      "explanation": "A prefix is contiguous from the beginning. The first difference ends it."
    },
    "labId": 6
  },
  {
    "slug": "kv-cache",
    "title": "7. KV Cache",
    "subtitle": "Reuse attention states as tokens arrive",
    "intro": "Autoregressive attention can reuse historical keys and values. Each new query compares against keys and combines values; it does not require recomputing every old token’s states.",
    "clarification": "Prefix cache is a serving-layer reuse policy across requests; KV cache is attention-state reuse during inference. billion-context manages messages, not the model’s internal K/V tensors.",
    "notes": "**KV Cache:** stores the **Key (K)** and **Value (V)** states of previously processed tokens so they can be reused during subsequent token generation.\n\n$$  \nQ_{\\text{new}}  \n\\rightarrow  \nK_{\\text{past}}  \n\\rightarrow  \nV_{\\text{past}}  \n$$\n\n- **K (Key):** used by future queries to determine which previous information is relevant.\n- **V (Value):** contains the information that can be retrieved and aggregated through attention.\n- **Q (Query):** represents what the current token is looking for. It is used for the current attention computation and does not need to be cached in the same way as historical K/V states.\n    \n\nTherefore:\n\n$$\n\\text{Store historical K and V states for reuse}  \n$$\n\n### Relationship to Prefix Cache\n\n```\nPrefix Cache\n     │\n     │ reuses computation for an unchanged prefix\n     ▼\nCached Model State\n     │\n     └── includes / is closely related to KV states\n```\n\nThe two concepts are related but should not be treated as identical:\n$$  \n\\boxed{  \n\\text{Prefix Cache} \\neq \\text{KV Cache}  \n}  \n$$\n\n**KV Cache** is a Transformer-level inference mechanism that stores the K/V states of previously processed tokens.\n\n**Prefix Cache** is a higher-level caching mechanism that allows computation associated with an unchanged input prefix to be reused across requests.\n\nConceptually:\n\n$$  \n\\text{Same Prefix}  \n\\Rightarrow  \n\\text{Reusable Cached Model State}  \n\\Rightarrow  \n\\text{Less Repeated Computation}  \n$$\n\n### Connection to billion-context\n\n`billion-context` tries to preserve prefix stability while compressing old context.\n\nIf the prefix remains unchanged:\n\n```\nRequest 1:\n[A B C D E]\n\nRequest 2:\n[A B C D E | F G]\n └─────────┘\n stable prefix\n```\n\nprevious computation associated with:\n\n```\n[A B C D E]\n```\n\ncan potentially be reused.\n\nIf an early part of the context is rewritten:\n\n```\nRequest 1:\n[A B C D E]\n\nRequest 2:\n[A X C D E]\n   ↑\n changed\n```\n\nthe shared prefix becomes much shorter:\n\n```\n[A]\n```\n\nTherefore:\n\n$$\n\\text{Stable Prefix}  \n\\Rightarrow  \n\\text{Higher Cache Reuse}  \n\\Rightarrow  \n\\text{Less Repeated Computation}  \n$$\n\nThis explains why `billion-context` emphasizes **prefix-cache-friendly incremental compression** instead of repeatedly rewriting the entire conversation history.",
    "quiz": {
      "question": "Which historical attention states are normally cached?",
      "answers": [
        "Queries only",
        "Keys and values",
        "The final answer only"
      ],
      "correct": 1,
      "explanation": "Historical K/V states are reusable. New queries are computed for the new token."
    },
    "labId": 7
  },
  {
    "slug": "fold",
    "title": "8. Fold",
    "subtitle": "Change the working view. Keep the source.",
    "intro": "A fold replaces a selected, consumed range of messages with a compact digest in the model’s working view. The original range remains stored and addressable, so the agent can inspect it again when exact details matter.",
    "clarification": "Folding changes the rendered input; it does not create extra native attention capacity. A digest is lossy prose. Exact recovery depends on retained originals and source references, not on reversing the summary itself. The diagrams show a conceptual layout, not a byte-for-byte proxy serialization.",
    "notes": "### What does “fold” mean?\n\nThink of a folder on a working desk. You replace a pile of already-read pages with a short cover note, while keeping the pages in storage. The cover note remains useful for orientation; the original pages are available for exact inspection.\n\nIn this notebook, a **fold** is the operation that turns a selected message range into an **addressable digest block** and changes which representation reaches the model. “Fold” also names the resulting working layout: digests alongside recent verbatim context.\n\n[Source: living preprint §3.1–3.2](https://github.com/ranxianglei/billion-context/blob/f2b180227d617e688a2a26113a638cf244fee018/paper/model-driven-incremental-hierarchical-compression-training-free-multi-generational-context-management-for-long-lived-coding-agents.md)\n\n### Before and after one fold\n\nSuppose m02–m04 contain a file read, a routing decision and a test log. After the task has used them, the model can request a compress operation for that range.\n\n$$\n[m_{02},m_{03},m_{04}]_{\\text{working view}}\n\\longrightarrow\nb_{01}\n$$\n\nThe block contains a digest such as “Keep the existing Next.js routes; tests passed,” plus references linking it to m02–m04. The original messages remain in source storage. Intent, constraints and recent work outside the selected range remain in the working view.\n\n| Layer | Before folding | After folding |\n| --- | --- | --- |\n| Working view | Raw m02–m04 plus surrounding messages | Digest b01 plus surrounding messages |\n| Source storage | Original m02–m04 | Original m02–m04 retained |\n| Addressing | Message references | Block ID plus source references |\n| Exact details | Directly visible in the raw range | Available through source recovery |\n\nThis separates **resident information** from **recoverable information**. The model can use a digest without attending to every original token on every request.\n\n### A summary is the content; a fold is the managed change\n\nA summary is shorter text. A recoverable fold additionally has a selected range, a block identity, source relationships and working-view bookkeeping. It coordinates summarization with storage and access.\n\nA digest alone cannot regenerate omitted quotes, numbers or code. Exact recovery reads the retained source. Other systems can also combine summaries with archived originals; “fold” describes this project’s managed block operation.\n\n### Choose consumed information\n\n“Consumed” means that the current task has already used the information and no longer needs all of its raw detail. It does not simply mean “old.”\n\nPreserve the useful conclusion, decisions, constraints, unresolved problems and identifiers in the digest. Keep active details raw when the task still needs them. The model chooses a candidate using the doctrine; the kernel validates its boundaries and protects designated zones.\n\n### Read the original without undoing the whole fold\n\nWhen the digest is insufficient, the model can use search_context to locate a relevant block, then decompress it.\n\nIn the reviewed proxy, decompression normally returns a **historical copy** or a **file pointer** while the block stays folded:\n\n- A copy supplies source text as a tool result, adding temporary input.\n- File output gives a path; the source text enters the request when the agent reads the needed content.\n- The inline whole-block path also records a sidecar flag for later handling. It does not generally delete the digest and permanently expand the range.\n\n[Source: resolveDecompress in src/decompress-shared.ts](https://github.com/ranxianglei/billion-context/blob/f2b180227d617e688a2a26113a638cf244fee018/src/decompress-shared.ts)\n\n### Why the preceding cache chapters matter\n\nA smaller working view reduces the amount of resident context to process. Cache reuse is a separate question: it depends on what tokens actually remain unchanged between requests.\n\nLocal folds aim to avoid unnecessary broad rewrites, and file-based recovery avoids immediately inserting all restored source text into the prompt. Neither guarantees that the entire old prefix stays reusable. If an early token changes, the common prefix ends there; provider cache policy still matters.\n\n### From one fold to a hierarchy\n\nOne consumed range becomes one digest block. Several independent folds produce several blocks. Those blocks can themselves accumulate, so the next chapter introduces **hierarchical compression**: distilling older digests into higher-tier blocks while retaining their source lineage.\n\nFirst understand the single operation: **select a consumed range → write a digest → change the working view → recover sources when needed**. The hierarchy builds on that operation.\n",
    "quiz": {
      "question": "After a recoverable fold, where do omitted exact details come from?",
      "answers": [
        "The digest mathematically reconstructs every token",
        "The retained original sources linked to the block",
        "A larger native attention window"
      ],
      "correct": 1,
      "explanation": "A fold changes the working representation. A summary is lossy; exact details are read from retained sources through their references."
    },
    "labId": 11
  },
  {
    "slug": "hierarchical-compression",
    "title": "9. Hierarchical Compression",
    "subtitle": "Across time. Up through tiers.",
    "intro": "Incremental compression handles separate consumed ranges over time. Hierarchical compression folds existing digests into a higher tier while keeping lineage to their sources.",
    "clarification": "Tier diagrams are conceptual. The source paper describes directBlockIds and effectiveMessageIds; the current proxy uses stored originals for recovery. Higher-tier summaries can omit detail even while the source remains recoverable.",
    "notes": "### Problem\n\nEven after old context is compressed into summaries, the number of summaries continues to grow during a long-running AI session.\n\nFor example:\n\n$$  \nS_1,\\ S_2,\\ S_3,\\ S_4,\\ \\ldots,\\ S_n  \n$$\n\nTherefore:\n\n$$  \n\\text{number of summaries} \\uparrow  \n\\Rightarrow  \n\\text{summary tokens} \\uparrow  \n$$\n\nA single layer of summarization is therefore not sufficient for extremely long sessions.\n\n---\n\n### Hierarchical Compression — Vertical Direction\n\n**Hierarchical compression** solves the growth of summaries by allowing summaries themselves to be compressed into higher-level summaries.\n\n$$  \n\\text{Raw Context}  \n\\rightarrow  \n\\text{Tier 1}  \n\\rightarrow  \n\\text{Tier 2}  \n\\rightarrow  \n\\text{Tier 3}  \n$$\n\nConceptually:\n\n```\n             Tier 3\n                ▲\n                │\n             Tier 2\n                ▲\n                │\n             Tier 1\n                ▲\n                │\n          Raw Context\n```\n\nTherefore:\n\n> **Hierarchical = vertical compression across tiers.**\n\nHigher tiers contain increasingly distilled representations of older information.\n\n---\n\n### Incremental Compression — Horizontal Direction\n\nInstead of repeatedly compressing the entire conversation history, `billion-context` compresses newly accumulated, already-consumed ranges separately.\n\nFor example:\n\n$$  \nA+B+C+D \\rightarrow S_1  \n$$\n\nLater:\n\n$$  \nE+F+G+H \\rightarrow S_2  \n$$\n\nLater:\n\n$$  \nI+J+K+L \\rightarrow S_3  \n$$\n\nProducing:\n\n$$  \nS_1 + S_2 + S_3 + \\text{recent context}  \n$$\n\nrather than repeatedly rewriting:\n\n$$  \nS_1 + \\text{new context}  \n\\rightarrow  \nS_2  \n\\rightarrow  \nS_3  \n\\rightarrow \\cdots  \n$$\n\nTherefore:\n\n> **Incremental = horizontal compression across newly accumulated context ranges.**\n\nConceptually:\n\n```\nTime →\n\n[A B C D] [E F G H] [I J K L] [Recent]\n     ↓         ↓         ↓\n    S1        S2        S3\n```\n\nSo we can think of the system along two dimensions:\n\n```\n                    Hierarchical\n                         ↑\n                         │\n                     Tier 3\n                         ↑\n                     Tier 2\n                         ↑\n                     Tier 1\n                         │\nS1 ───── S2 ───── S3 ───── S4 ─────→ Time\n                         │\n                    Incremental\n```\n\n---\n\n### Lineage → Reversibility\n\nEach compressed block retains information about where it came from.\n\nConceptually:\n\n```\nTier 2 Digest\n      │\n      ├── Tier 1 Block S1\n      │       ├── Original Message 1\n      │       └── Original Message 2\n      │\n      └── Tier 1 Block S2\n              ├── Original Message 3\n              └── Original Message 4\n```\n\nThis source relationship is called **lineage**.\n\nTherefore:\n\n$$  \n\\text{Lineage}  \n\\Rightarrow  \n\\text{Traceable Source}  \n\\Rightarrow  \n\\text{Recoverability}  \n$$\n\nwhich enables:\n\n$$  \n\\boxed{  \n\\text{Lineage}  \n\\Rightarrow  \n\\text{Reversibility}  \n}  \n$$\n\n### Key Takeaway\n\nThe architecture can be summarized with three ideas:\n\n$$  \n\\boxed{  \n\\begin{aligned}  \n\\text{Hierarchical} &\\rightarrow \\text{vertical compression across tiers} \\\\  \n\\text{Incremental} &\\rightarrow \\text{horizontal compression over time} \\\\  \n\\text{Lineage} &\\rightarrow \\text{reversible access to compressed history}  \n\\end{aligned}  \n}  \n$$",
    "quiz": {
      "question": "Folding S1 and S2 into a tier-2 digest is which direction?",
      "answers": [
        "Horizontal incrementality",
        "Vertical hierarchy"
      ],
      "correct": 1,
      "explanation": "Horizontal handles new ranges across time. Vertical re-distills digests across tiers."
    },
    "labId": 8
  },
  {
    "slug": "compression-doctrine",
    "title": "10. Compression Doctrine",
    "subtitle": "Semantic judgment meets structural safeguards",
    "intro": "The model uses task meaning to choose useful summaries. The kernel supplies stable references, protected ranges, visibility rules and budget enforcement.",
    "clarification": "Age and relevance are teaching heuristics, not an implemented numerical scoring function. Kernel protections can reject a proposed range. Recent-tool exclusions and protected tool settings are configurable.",
    "notes": "### Compression Decision\n\nConceptually, we can understand the compression decision as:\n$$\nf(  \n\\text{task relevance},  \n\\text{importance},  \n\\text{age}  \n)  \n$$\n\nThis is a conceptual model rather than a literal scoring function implemented by `billion-context`.\n\nThe central question is:\n\n> **Is this content still needed by the current task step?**\n\n---\n\n### Consumed Context\n\n**Consumed context** refers to information that has already served its purpose in the current task.\n\nFor example:\n\n$$  \n\\text{Large Tool Output}  \n\\rightarrow  \n\\text{Model Analysis}  \n\\rightarrow  \n\\text{Useful Conclusion}  \n$$\n\nOnce the useful information has been extracted, much of the original tool output may become a candidate for compression.\n\n---\n\n### Recent Context\n\nRecent context has a:\n\n> **higher probability of still being actively used**\n\nTherefore:\n\n$$  \n\\text{Recent}  \n\\not\\equiv  \n\\text{Important}  \n$$\n\nbut generally:\n\n$$  \n\\text{Recent}  \n\\Rightarrow  \nP(\\text{still actively needed}) \\uparrow  \n$$\n\nThis is why recent working context is usually preserved with higher fidelity.\n\n---\n\n### Protected Zones\n\nSome parts of the context should not immediately become compression candidates.\n\nConceptually:\n\n```\nOld                                      Recent\n\n[compressible] [compressible] [compressible] [PROTECTED]\n      ↓              ↓              ↓             │\n    fold           fold           fold          KEEP\n```\n\nProtected zones help preserve information that is still actively involved in the current task.\n\n---\n\n### Information Selection\n\nRaw context can conceptually be divided into:\n\n$$\n\\text{Important Information}  \n+  \n\\text{Ephemeral Detail}  \n$$\n\nCompression attempts to:\n\n$$  \n\\boxed{  \n\\text{KEEP important information}  \n+  \n\\text{DROP low-value ephemeral detail}  \n}  \n$$\n\nThe objective is therefore not simply maximum compression.\n\nInstead:\n\n$$\n\\text{Token Reduction}  \n+  \n\\text{Information Preservation}  \n$$\n\n---\n\n### Compression Doctrine\n\n**Compression Doctrine** is the set of instructions that guides the model's compression decisions.\n\nIt helps determine:\n\nWhat to compress\n\n### Kernel\n\nThe **Kernel** is the core execution and state-management engine of `billion-context`.\n\nIt does not mainly decide **what information is semantically important**. Instead, it executes and manages context operations after the model makes semantic decisions.\n\n```\nModel + Doctrine\n      │\n      │ WHAT / WHEN to compress\n      ▼\n    Kernel\n      │\n      │ HOW to execute and manage it\n      ▼\n Context State\n```\n\nThe Kernel manages:\n\n- message and block IDs\n- compression blocks\n- tiers\n- lineage\n- context visibility\n- context budget\n- compression / restoration state\n\nIn short:\n\n> **Model + Doctrine make semantic decisions; Kernel executes and manages those decisions.**\n\nTherefore, the Kernel can be understood as the **Context Management Engine** of `billion-context`.\n\n\nConceptually:\n\n```\n             billion-context\n                    │\n        ┌───────────┴───────────┐\n        ▼                       ▼\n      Kernel             Model + Doctrine\n        │                       │\n        ▼                       ▼\nContext Infrastructure    Semantic Judgment\n        │                       │\n        ▼                       ▼\n Manage structure,        Understand meaning,\n state, blocks, tiers,    decide what to compress\n lineage and budgets      and what to preserve\n```\n\nIn short:\n\n> **Kernel manages the context; the model understands the context.**",
    "quiz": {
      "question": "An old message is still essential to the current debugging step. What should semantic judgment favor?",
      "answers": [
        "Compress because it is old",
        "Preserve it for now"
      ],
      "correct": 1,
      "explanation": "The criterion is current task need. Age alone is insufficient."
    },
    "labId": 9
  },
  {
    "slug": "growth-gate",
    "title": "11. Growth Gate",
    "subtitle": "When to ask is not what to compress",
    "intro": "A growth-gated nudge invites the model to assess compression. The model can decline during active work or initiate a fold without a nudge; emergency paths are separate.",
    "clarification": "The normal nudge uses a context floor plus growth conditions, with adaptive thresholds and tier-specific paths. The demo simplifies these conditions. maxContextLimit can bypass growth/cadence, and emergency truncation is a separate backstop.",
    "notes": "The **Growth Gate** determines **when the system should start evaluating whether compression is needed**.\n\nIt is part of the Kernel's context-management process rather than the Compression Doctrine.\n\nThe basic workflow is:\n\n```\nKernel\n   │\n   │ monitors context growth\n   ▼\nGrowth Gate\n   │\n   │ enough new context accumulated?\n   ▼\nModel + Doctrine\n   │\n   │ semantic judgment\n   │ what should be compressed?\n   ▼\nKernel\n   │\n   │ execute compression\n   │ update blocks / tiers / lineage\n   ▼\nFold\n```\n\nTherefore:\n\n**Growth Gate = When to CHECK**\n\n**Model + Doctrine = What to COMPRESS**\n\n**Kernel = Monitor, manage, and EXECUTE**\n\nThe overall process can be summarized as:\n\n$$  \n\\mathrm{Context\\ Growth}  \n\\rightarrow  \n\\mathrm{Growth\\ Gate}  \n\\rightarrow  \n\\mathrm{Semantic\\ Evaluation}  \n\\rightarrow  \n\\mathrm{Kernel\\ Execution}  \n\\rightarrow  \n\\mathrm{Fold}  \n$$\n\nThe Growth Gate is useful because compression itself has a cost. The system therefore does not need to evaluate and compress the context after every single turn.\n\nInstead, it waits until enough new context has accumulated before starting another compression evaluation.\n\n> **The Gate determines when to ask; the Model + Doctrine determine what to compress; the Kernel executes and manages the result.**",
    "quiz": {
      "question": "A nudge fires in the middle of a critical task. Must the model compress?",
      "answers": [
        "Yes, the gate chooses the range",
        "No, it can refuse and continue"
      ],
      "correct": 1,
      "explanation": "The gate invites evaluation. The model retains semantic choice; hard budget backstops are separate."
    },
    "labId": 10
  }
];
