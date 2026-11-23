# Layla Web — Rebuild Contract

This document records the accepted direction for the project. It is a delivery contract, not a claim that these systems already exist.

## Non-negotiable world rules
- Layla is the only human character in the entire world.
- Every other living creature is an animal; never add human NPCs, visitors, crowds, or background people.
- Keep a balanced focus between Layla's daily life and a genuinely explorable world.
- Preserve existing working features. Do not silently remove a feature; replacement must be demonstrably equal or better.
- Arabic-first interface and mobile-first performance. Keep the project usable without paid services.
- Never mark a feature complete until its implementation and actual behavior have been checked.

## Accepted 100-idea map
The accepted roadmap contains 100 ideas in ten groups:
1. World and environment (1–10)
2. Layla and her daily life (11–20)
3. Interaction (21–30)
4. Characters and relationships (31–40) — animals only besides Layla
5. Exploration (41–50)
6. Quests and activities (51–60)
7. World systems (61–70)
8. AI and memory (71–80)
9. Visuals, audio, and interface (81–90)
10. Major expansions (91–100)

The detailed original wording of every numbered idea must be recovered from the prior planning conversation before checking off individual items. This grouped index is not a substitute for that original list.

## Required quality bar
### Controls
Immediate-feeling movement, responsive camera, reliable touch joystick, adjustable sensitivity, collision that does not trap the player, and stable frame pacing on phones.

### Art direction
A coherent anime-inspired 3D world: consistent stylized proportions, materials, lighting, color grading, vegetation, architecture, weather, and animation. Do not mix primitive placeholder animals with polished assets and call the result finished.

### Layla
A distinctive complete character, not a collection of placeholder primitives: coherent face and anatomy, long layered copper-red hair, clothing with shape and detail, expressive facial states, body rig, locomotion, idle actions, contextual gestures, and natural behavior. Preserve the established copper palette: base #B94A2F, shadow #8E3025, highlight #D16A3D.

### Animals
Use appropriate, compatible rigged models and real animation clips where possible. Animals need individual movement, rest, feeding, curiosity, avoidance, social behavior, habitat preferences, and reactions to Layla and the player. Birds must have believable silhouettes, wings, flight paths, and perching.

### AI Layla
Separate the language model from the character/personality layer. Support a locally runnable quantized model when feasible, with optional online inference when connected. Add persistent local memory with user control, conversation context, tool permissions, and a clear offline mode. Layla's default Arabic voice and wording should be Saudi Najdi; text generation and speech synthesis are separate components and must be evaluated separately. Do not ship secrets in client code.

### Extensions and assets
Evaluate large open-source libraries, models, animation packs, shaders, terrain tools, audio, and mods for license, browser compatibility, mobile performance, file size, and actual usefulness. No random asset dumping. Every imported asset must have provenance and a role in the world.

## Implementation order
1. Controls, input latency, camera, collision, and mobile frame pacing.
2. Art-direction foundation and consistent asset pipeline.
3. Complete Layla character, rig, animation, and daily-life state machine.
4. Animal ecosystem and believable bird flight.
5. World simulation: time, weather, seasons, lighting, habitats, soundscape, and environmental reactions.
6. Interaction framework, objects, buildings, interiors, inventory, crafting, and persistence.
7. Exploration, quests, discoveries, and world progression.
8. AI architecture: local model evaluation, online adapter, memory, Najdi language behavior, and speech.
9. Audio/visual polish, accessibility, settings, and mobile optimization.
10. Major expansions and additional regions only after the foundation is stable.

## Current verified status at the time of writing
- Three.js scene, basic terrain, trees, cabin, pond, lights, simple player movement, simple Layla mesh, primitive rabbit/bird animation, and an experimental external GLB loader exist.
- Layla dialogue is currently hard-coded text; there is no connected language model or Najdi speech system.
- Current bird shapes are primitive geometry, not finished bird assets.
- Layla is not a finished anime-quality character.
- The 100 roadmap ideas are not implemented as complete systems.
- External GLB assets have a download script; their presence on the user's phone and their visual correctness must be verified separately.
- Control responsiveness was adjusted in commit ef81aa2315ca0829c0260f8689bbe1d1dcf986ce; device testing is still required.

## Completion rule
Track every numbered roadmap item as: not started / in progress / implemented / tested on target phone. "Implemented" and "tested" are different states. A screenshot, runtime log, or reproducible test should support completion claims.
