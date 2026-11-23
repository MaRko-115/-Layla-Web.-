# Layla — focused project scope

This scope supersedes the earlier open-world-first implementation order for the current delivery.

## Product goal
A compact Arabic-first Layla experience: a small four-room home that lets the user see and interact with Layla, with the conversation/assistant system as the primary product. The website is a visual shell and control surface, not a large open-world game.

## Included now
1. Replace the outdoor valley as the primary scene with one connected home containing:
   - living room
   - library
   - bedroom
   - kitchen
2. Prefer ready-to-use, legally reusable 3D assets and animation clips. Adapt and assemble assets; do not hand-model every prop or animation.
3. Replace the procedural placeholder Layla with a suitable licensed, rigged stylized/anime character model when a compatible asset is verified. Preserve her copper-red hair identity through customization where the asset permits.
4. Make Layla's conversation the central interaction. Keep the language/personality layer separate from the 3D avatar and UI.
5. Prepare a clean, explicit integration boundary for the existing private WhatsApp/Termux command system and the scheduled US-video workflow. Do not fake a working connection when the backend is absent.
6. Keep the site lightweight, mobile-first, Arabic RTL, and free to operate.

## Explicitly out of scope for this delivery
- open-world regions, large maps, quests, crafting, multiplayer, and game-scale simulation
- image-analysis tooling inside Termux
- new side projects or unrelated feature ideas
- rebuilding a model or asset from scratch when a suitable licensed ready asset exists

## Preservation and safety
- Do not delete the existing valley scene, character code, asset loader, or current functionality until a replacement is present and verified. Keep the old scene available as a fallback during transition.
- Do not add API keys, WhatsApp credentials, or private tokens to browser code or the public repository.
- Never claim an asset is installed on the phone because its download script was committed.
- Never mark a feature complete based only on code existence. Distinguish implemented, runtime-checked, and checked on the target phone.

## Delivery sequence
1. Audit current files and dependencies; identify the existing WhatsApp/Termux integration boundary.
2. Verify and select licensed ready assets for the home, furniture, character, and animations.
3. Add the home scene alongside the existing valley and switch only after it renders reliably.
4. Add the four-room navigation and interactions.
5. Integrate the conversation UI with a real backend adapter; keep offline/error states honest.
6. Connect the existing private WhatsApp/Termux commands without exposing credentials.
7. Test on the target Android browser, then retire only obsolete temporary files after backups and parity checks.
