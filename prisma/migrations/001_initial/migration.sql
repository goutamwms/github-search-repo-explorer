-- CreateUsersTable
CREATE TABLE "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    name TEXT,
    github_id TEXT DEFAULT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndexOnEmail
CREATE INDEX "User_email_idx" ON "User"(email);


-- CreateNotesTable
CREATE TABLE "Note" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    user_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndexOnUserIdInNotes
CREATE INDEX "Note_user_id_idx" ON "Note"(user_id);

