# chalkdeck

A workspace where one teacher and their AI agents author, keep, and publish interactive teaching
decks for classes and teacher-training workshops.

## People

**Author** (作者):
The repository owner, together with the AI agents working on their behalf. There are no other
authors; no other teacher contributes decks.
_Avoid_: user, contributor, teacher (when meaning the author role)

**Repository owner** (repo 擁有者):
CXPhoenix in person, without the agents. Only the repository owner holds the rights the
repository licenses, and only their answer can settle who owns a piece of material.
_Avoid_: author (when agents must be excluded), licensor, maintainer

**Reuser** (再利用者):
Anyone who copies or adapts material from the repository under its licenses. Not someone the
repository is built for; a reuser follows from the decks being public.
_Avoid_: reader, user, audience (when meaning someone reusing material)

**Audience** (觀眾):
The students and workshop participants a deck is presented to.
_Avoid_: reader, visitor, public

## Decks

**Deck**:
One presentation, living in `slides/<deck id>/` and self-contained: its boilerplate is inlined, so
later template changes never alter it.
_Avoid_: slide (for the whole presentation), presentation, 簡報檔

**Deck id**:
The folder name of a deck, which is also its public URL path (`/s/<deck id>`).
_Avoid_: slug, deck name

**Public deck** (公開 deck):
A deck listed in the allowlist and therefore built and deployed by a Release. Every other deck is
private by default and has no reachable URL.
_Avoid_: published deck, live deck

**Delivered deck** (已講過的 deck):
A deck that has been presented to an audience. It is frozen as the record of that talk: only typo
and broken-link fixes; a reworked or repeated talk gets a new deck id.
_Avoid_: old deck, archived deck, finished deck

**Talk record** (演講歷程):
The set of public decks, each URL standing for what was said at one talk.
_Avoid_: portfolio, history, archive

**Allowlist**:
`deploy/public-decks.txt`, the only switch that makes a deck public.
_Avoid_: publish list, whitelist

**Theme**:
A reusable visual system for decks, kept as `themes/<id>.md` plus a runnable demo.
_Avoid_: template (for a theme), skin, style

## Work

**Deck content work** (deck 內容工作):
A change confined to one deck's `slides/<deck id>/` folder, including its own assets.
_Avoid_: slide edit, content change

**Template work** (模板／工具工作):
A change to anything shared across decks: themes, scripts, global assets, deploy configuration,
skills, or project configuration.
_Avoid_: framework work, infra work
