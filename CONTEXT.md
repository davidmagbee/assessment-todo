# Todo workspace

Shared language for private task management and future collaboration.

## Language

**Task**:
A to-do item with status To-do, In progress, or Done.
_Avoid_: Ticket, issue (reserved for development work tracking).

**Guest**:
A person using the application without signing in; their default task list is private to their guest identity.
_Avoid_: Public user (guest does not imply public access).

**Personal list**:
The private collection of tasks belonging to a signed-in person.
_Avoid_: Public board, team board.

**Guest import**:
A deferred capability for explicitly transferring guest tasks into a signed-in person's personal list. Initial release keeps guest and account lists separate.
_Avoid_: Sync (import does not imply ongoing synchronization).

**Public board**:
A future, explicitly chosen shared task collection accessible to guests.
_Avoid_: Guest list (private by default).

**Team board**:
A future task collection accessible to members of a particular team.
_Avoid_: Personal list.
