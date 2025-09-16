-- CreateTable
CREATE TABLE "Uplink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deviceId" TEXT NOT NULL,
    "receivedAt" DATETIME NOT NULL,
    "temperature" REAL,
    "humidity" REAL,
    "rawPayload" JSONB NOT NULL
);

-- CreateIndex
CREATE INDEX "Uplink_deviceId_idx" ON "Uplink"("deviceId");
