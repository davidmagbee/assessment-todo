# Private owner lists before collaboration

Initial release provides one private list per account or guest, with no import. Signing in switches to the account list; signing out restores a still-valid guest list. Guest identity expires 30 days after creation. This limits initial permission complexity while preserving a later migration path to team/public boards; ownership must be enforced server-side on every task operation.
