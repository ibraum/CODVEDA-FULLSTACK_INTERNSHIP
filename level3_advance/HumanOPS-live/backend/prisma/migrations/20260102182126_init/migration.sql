-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN_RH', 'MANAGER', 'COLLABORATOR');

-- CreateEnum
CREATE TYPE "Workload" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('AVAILABLE', 'MOBILISABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "TensionLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReinforcementStatus" AS ENUM ('OPEN', 'CLOSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReinforcementResponse" AS ENUM ('ACCEPTED', 'REFUSED', 'NO_RESPONSE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaboratorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollaboratorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaboratorSkill" (
    "id" TEXT NOT NULL,
    "collaboratorId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "CollaboratorSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HumanState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workload" "Workload" NOT NULL,
    "availability" "Availability" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HumanState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HumanStateHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "humanStateId" TEXT NOT NULL,
    "previousState" JSONB NOT NULL,
    "newState" JSONB NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HumanStateHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReliabilityScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReliabilityScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReinforcementRequest" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "requiredSkills" JSONB NOT NULL,
    "urgencyLevel" INTEGER NOT NULL,
    "status" "ReinforcementStatus" NOT NULL DEFAULT 'OPEN',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReinforcementRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReinforcementResponseModel" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "response" "ReinforcementResponse" NOT NULL,
    "respondedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReinforcementResponseModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TensionLevelSnapshot" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "level" "TensionLevel" NOT NULL,
    "metrics" JSONB NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TensionLevelSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetRole" "Role",
    "userId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RHSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RHSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RHSettingHistory" (
    "id" TEXT NOT NULL,
    "settingId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RHSettingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_userId_key" ON "TeamMember"("userId");

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CollaboratorProfile_userId_key" ON "CollaboratorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CollaboratorSkill_collaboratorId_skillId_key" ON "CollaboratorSkill"("collaboratorId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "HumanState_userId_key" ON "HumanState"("userId");

-- CreateIndex
CREATE INDEX "HumanState_userId_idx" ON "HumanState"("userId");

-- CreateIndex
CREATE INDEX "HumanStateHistory_userId_idx" ON "HumanStateHistory"("userId");

-- CreateIndex
CREATE INDEX "HumanStateHistory_changedAt_idx" ON "HumanStateHistory"("changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReliabilityScore_userId_key" ON "ReliabilityScore"("userId");

-- CreateIndex
CREATE INDEX "ReinforcementRequest_status_idx" ON "ReinforcementRequest"("status");

-- CreateIndex
CREATE INDEX "ReinforcementRequest_expiresAt_idx" ON "ReinforcementRequest"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReinforcementResponseModel_requestId_userId_key" ON "ReinforcementResponseModel"("requestId", "userId");

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_targetRole_idx" ON "Alert"("targetRole");

-- CreateIndex
CREATE INDEX "Alert_isRead_idx" ON "Alert"("isRead");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RHSetting_key_key" ON "RHSetting"("key");

-- CreateIndex
CREATE INDEX "RHSetting_key_idx" ON "RHSetting"("key");

-- CreateIndex
CREATE INDEX "RHSettingHistory_settingId_idx" ON "RHSettingHistory"("settingId");

-- CreateIndex
CREATE INDEX "RHSettingHistory_changedBy_idx" ON "RHSettingHistory"("changedBy");

-- CreateIndex
CREATE INDEX "RHSettingHistory_changedAt_idx" ON "RHSettingHistory"("changedAt");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaboratorProfile" ADD CONSTRAINT "CollaboratorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaboratorSkill" ADD CONSTRAINT "CollaboratorSkill_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "CollaboratorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaboratorSkill" ADD CONSTRAINT "CollaboratorSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanState" ADD CONSTRAINT "HumanState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanStateHistory" ADD CONSTRAINT "HumanStateHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanStateHistory" ADD CONSTRAINT "HumanStateHistory_humanStateId_fkey" FOREIGN KEY ("humanStateId") REFERENCES "HumanState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReliabilityScore" ADD CONSTRAINT "ReliabilityScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReinforcementRequest" ADD CONSTRAINT "ReinforcementRequest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReinforcementResponseModel" ADD CONSTRAINT "ReinforcementResponseModel_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ReinforcementRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReinforcementResponseModel" ADD CONSTRAINT "ReinforcementResponseModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TensionLevelSnapshot" ADD CONSTRAINT "TensionLevelSnapshot_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RHSettingHistory" ADD CONSTRAINT "RHSettingHistory_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "RHSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RHSettingHistory" ADD CONSTRAINT "RHSettingHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
