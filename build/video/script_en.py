"""Cards and narration for the English demo video (see build_video.py).

Each SEGMENT is a card (`card` + `intro` narration) and/or a clip (`clip` + `say` narration). A line is a string (spoken text, also used as the caption)
or {"t": spoken text, "c": caption text, "at": seconds from the start of the clip/card}. "at" lets a sentence wait for the matching moment on screen;
sentences never overlap. Numbers come from assets/en/run-metrics.json (the English recorded Copilot session) and from the English Foundry recording.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CLIP_DIR = ROOT / "assets" / "en" / "clips"
NAME = "Microsoft_Foundry_GitHub_Copilot_Demo_EN"

FOOT_PAGE = ""

CARDS = [
    {"id": "title", "type": "title", "title": "AI app development, shown in demos",
     "sub": "Build, protect and evaluate an AI app, shown in real screen recordings instead of slides.",
     "pill1": "Foundry demos 5", "pill2": "Copilot demos 6"},
    {"id": "part1", "type": "part", "color": "blue", "kicker": "PART 1  ·  MICROSOFT FOUNDRY", "title": "From model choice to evaluation, in one portal",
     "sub": "Five demos on the English portal, recorded on 2026-11-11.", "on": -1,
     "chips": [{"n": 1, "t": "Catalog", "s": "find and compare models"}, {"n": 2, "t": "Deploy", "s": "one click, then chat"},
               {"n": 3, "t": "Agent", "s": "answers from our document"}, {"n": 4, "t": "Guardrails", "s": "block at the input"},
               {"n": 5, "t": "Evaluations", "s": "score quality and safety"}]},
    {"id": "part2", "type": "pipeline", "kicker": "PART 2  ·  GITHUB COPILOT", "title": "Handing work to custom agents",
     "sub": "One change request (CR-2026-014, a refund policy change) moves through the stages. People approve in three places.",
     "steps": [["Analyze", "change-analyst"], ["Design", "solution-architect"], ["Build", "app-developer"], ["Test", "qa-engineer"], ["Review", "code-reviewer"], ["Deploy", "release-manager"]],
     "gates": [[1, 545], [2, 1376], [3, 1618]],
     "bar1": ["3 human approvals", "1 design  ·  2 code  ·  3 production deploy  (plus 3 decisions)"],
     "bar2": ["Hook safeguards", "Edits before approval and dangerous commands are blocked by the system"]},
    {"id": "results", "type": "results", "kicker": "RESULT  ·  GITHUB COPILOT", "title": "One change request, 38 minutes, six human interventions",
     "sub": "Measured in the English recorded session of the ShopFlow demo kit.",
     "tiles": [{"v": "38<span>min</span>", "l1": "Seven stages, start to finish", "l2": "Analyze to operations analysis", "c": "#BDA6FF"},
               {"v": "26→100", "l1": "Tests, before and after", "l2": "99% coverage", "c": "#BDA6FF"},
               {"v": "6", "l1": "Human interventions", "l2": "3 approvals + 3 decisions", "c": "#F0B429"},
               {"v": "$3.40", "l1": "AI usage, whole session", "l2": "340 AI Credits", "c": "#BDA6FF"}],
     "note": "One run of a fictional store. Your results will differ with your code, your models and your process."},
    {"id": "next", "type": "next", "kicker": "NEXT STEP", "title": "Try it on your own work in two weeks",
     "sub": "Three things to take away, and a proposal.",
     "items": ["One portal for model choice, deployment, agents, guardrails and evaluation.",
               "Agents do the work; people approve and the system blocks. Speed with control.",
               "Together: build fast with Copilot, then operate with trust in Foundry.",
               "Proposal: a two-week proof of concept on one or two of your workloads."]},
]

S = []   # segments

S.append({"card": "title", "chapter": "Introduction", "intro": [
    "Today we skip the slides and watch real screen recordings.",
    "Eleven demos, from choosing a model to shipping a change, and the safeguards that keep it trustworthy."]})

S.append({"card": "part1", "chapter": "Microsoft Foundry", "intro": [
    "Part one is Microsoft Foundry.",
    "Choose a model, deploy it, build an agent on your own document, protect it with guardrails, and then evaluate it."]})

S.append({"clip": "f1_catalog", "chapter": "Demo 1: Model catalog and compare", "say": [
    {"t": "The catalog puts models from many providers in one place: OpenAI, Anthropic, Microsoft, Meta, Mistral, DeepSeek and more.", "at": 0.4},
    {"t": "In the Models tab we search and filter. Here, a search for Claude lists seventeen models, and we can narrow them down by publisher.", "at": 11.0},
    {"t": "Then Compare models. Three models side by side: quality, safety, estimated cost and throughput, plus supported endpoints.", "at": 21.6},
    {"t": "Swap a model in the dropdown and the numbers update. These are benchmark values. For your own task, you evaluate, as in demo five.", "at": 32.0},
]})

S.append({"clip": "f2_deploy", "chapter": "Demo 2: Deploy and test", "say": [
    {"t": "Pick a model and deploy it. Here we use G P T six point one sol.", "c": "Pick a model and deploy it. Here we use gpt-6.1-sol.", "at": 0.4},
    {"t": "Default settings means Global Standard with the default quota. Custom settings gives you more control.", "at": 9.8},
    {"t": "The Playground opens right away. We ask for an apology to a customer whose delivery is late, and the answer comes back.", "at": 16.6},
    {"t": "Continue in code shows a Python sample that signs in with Entra I D. A P I key authentication is disabled, so no key goes into your code.",
     "c": "Continue in code shows a Python sample that signs in with Entra ID. API key authentication is disabled, so no key goes into your code.", "at": 23.6},
]})

S.append({"clip": "f3_agent", "chapter": "Demo 3: An agent on our own document", "say": [
    {"t": "Next, an agent that answers from our own document. In Agents, choose New agent and give it a name.", "at": 0.4},
    {"t": "We write its role and rules as plain instructions, and pick a model.", "at": 10.4},
    {"t": "Then we upload the refund policy as knowledge. Foundry builds a vector index and gives the agent a File search tool.", "at": 23.0},
    {"t": "Now the test. A VIP customer asks about a purchase made forty-five days ago. VIP members have sixty days, and the agent cites the policy section and the source file.", "at": 38.2},
    {"t": "And one million five hundred thousand won? Not processed immediately. Above one million won needs admin approval: section three.",
     "c": "And KRW 1,500,000? Not processed immediately. Above KRW 1,000,000 needs admin approval: section 3.", "at": 48.2},
]})

S.append({"clip": "f4_guardrails", "chapter": "Demo 4: Guardrails", "say": [
    {"t": "Guardrails. The default guardrail, Default V2, applies to every deployment automatically.",
     "c": "Guardrails. The default guardrail, DefaultV2, applies to every deployment automatically.", "at": 0.4},
    {"t": "Its policy covers jailbreak attempts on user input, content safety, and protected material.", "at": 5.9},
    {"t": "Now a classic jailbreak prompt: pretend to be S T A N, a model that never refuses.", "c": "Now a classic jailbreak prompt: pretend to be STAN, a model that never refuses.", "at": 11.0},
    {"t": "Blocked at the input, before the model answers. The risk type, jailbreak, is shown.", "at": 21.6},
]})

S.append({"clip": "f5_eval", "chapter": "Demo 5: Evaluations", "say": [
    {"t": "The last Foundry demo is Evaluations. We choose the agent we just built.", "at": 0.4},
    {"t": "Scope and frequency: individual turns, run one time.", "at": 6.4},
    {"t": "For test data, Foundry reads the agent's instructions and generates fifteen questions. We add a hint about what to cover.", "at": 12.2},
    {"t": "Then the evaluators: tool use, output quality, and four safety checks.", "at": 21.4},
    {"t": "Review and submit. A few minutes later the run is complete, and the waiting is cut.", "at": 27.6},
    {"t": "Tool use passed fourteen of fifteen, and every safety check passed all fifteen. Output quality failed all fifteen. That is the weak spot to open, row by row.", "at": 35.4},
]})

S.append({"card": "part2", "chapter": "GitHub Copilot", "intro": [
    "Part two is GitHub Copilot, and this time we hand work over.",
    "One business change request, a refund policy change, flows through custom agents, one per stage.",
    "People approve in three places, and a hook blocks anything that breaks the rules."]})

S.append({"clip": "cp1_analyze", "chapter": "Demo 6: Analyze", "say": [
    {"t": "The change request goes to a custom Copilot agent, the Change Analyst.", "at": 0.4},
    {"t": "It reads the code, the documents and the real database, read-only. The long wait is sped up.", "at": 11.0},
    {"t": "Out comes an impact analysis: areas affected, data anomalies, and decisions for a human. Nothing has been changed yet.", "at": 22.0},
]})

S.append({"clip": "cp2_design", "chapter": "Demo 7: Design", "say": [
    {"t": "Next, the Solution Architect agent writes the design, and it is told to ask about any decision that needs one.", "at": 0.4},
    {"t": "Here it stops and asks. It offers a recommendation, and the human decides. In this run, one answer was typed in instead of the recommended option.", "at": 8.2},
    {"t": "Then the first gate: design approval, tied to a hash of the design document. If the design changes later, the approval is void.", "at": 32.6},
]})

S.append({"clip": "cp3_build_test", "chapter": "Demo 8: Build and test", "say": [
    {"t": "With the design approved, the Developer agent implements exactly that, then commits.", "at": 0.4},
    {"t": "It changes the database migration, the business rules, the screen and the e-mail wording together. This stretch is sped up.", "at": 6.6},
    {"t": "A separate Tester agent then verifies the work. It cannot change production code. It writes and runs tests, and reports defects.", "at": 18.6},
    {"t": "Seventy-four new tests, all one hundred passing, at ninety-nine percent coverage.", "c": "74 new tests, all 100 passing, at 99% coverage.", "at": 28.0},
]})

S.append({"clip": "cp4_review", "chapter": "Demo 9: Review", "say": [
    {"t": "The Reviewer agent compares the changes with the design, the company standards and the security checklist, and hands the deep security scan to a dedicated agent.", "at": 0.4},
    {"t": "Notice the red line: the reviewer tried to commit its own report, and a hook denied it.", "at": 15.0},
    {"t": "Then the second gate: code approval, tied to the hash of the reviewed code.", "at": 20.3},
    {"t": "Zero blockers, zero major, zero minor. A human approves.", "at": 24.6},
]})

S.append({"clip": "cp5_deploy", "chapter": "Demo 10: Deploy", "say": [
    {"t": "The Release Manager agent merges, writes the release plan for version one point one point zero, and deploys to staging first.",
     "c": "The Release Manager agent merges, writes the release plan for v1.1.0, and deploys to staging first.", "at": 0.4},
    {"t": "Then a smoke test. This stretch is sped up.", "at": 11.0},
    {"t": "The third gate: production deploy approval. The pop-up appears right before the deploy script runs, enforced by a hook.", "at": 21.6},
    {"t": "Production is live. Staging passed six of six checks, and rollback is ready.", "at": 28.6},
]})

S.append({"clip": "cp7_guardrail", "chapter": "Demo 11: Safeguards", "say": [
    {"t": "Now the opposite test. This agent does not know the rules, and we tell it to change the code without approval.", "at": 0.4},
    {"t": "Blocked by the system: no code changes before design approval.", "at": 12.6},
    {"t": "Next, we tell it to edit the company security standard.", "at": 17.2},
    {"t": "Blocked again. Standards, agent definitions, hooks and approval records are protected.", "at": 23.0},
    {"t": "Finally, a dangerous command: push straight to main. Blocked. Rules like this are enforced by code, not by a prompt.", "at": 32.0},
]})

S.append({"card": "results", "chapter": "Results", "intro": [
    "The numbers from the recorded session: thirty-eight minutes across seven stages, six human interventions, three approvals and three decisions,",
    "tests up from twenty-six to one hundred, and about three dollars forty of AI usage.",
    "It is one run of a fictional store, so treat it as an example, not a promise."]})

S.append({"card": "next", "chapter": "Next step", "intro": [
    "Three things to take away.",
    "One portal covers model choice, deployment, agents, guardrails and evaluation.",
    "Agents do the work, people approve, and the system blocks. That is speed with control.",
    "Together, Copilot builds fast and Foundry lets you operate with trust.",
    "To try it on your own work, we propose a two-week proof of concept. Pick one or two workloads, and we will measure it together."]})

SEGMENTS = S
