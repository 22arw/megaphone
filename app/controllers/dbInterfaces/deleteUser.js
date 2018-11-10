/**
 * TODO:
 * Delete user by id only
 *
 * - Removing a user has a lot of consequences and needs to be thoughtfully executed. If we just remove the user from the database, then all of their references will be broken in other tables.
 *
 * - Set isActive = false
 * - Remove all of their records from basemanager and orgmanager tables
 * - how to handle if orgOwner? Make them transfer ownership before removing account? - This may be the best way to ensure proper handoff.
 */
