/*
  Warnings:

  - Added the required column `subtotal` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" REAL NOT NULL DEFAULT 0,
    "discountPercent" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "customerName" TEXT,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("createdAt", "createdById", "customerName", "date", "id", "notes", "paymentMethod", "total", "subtotal", "discountPercent") 
SELECT "createdAt", "createdById", "customerName", "date", "id", "notes", "paymentMethod", "total", "total", 0 FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
CREATE INDEX "Sale_date_idx" ON "Sale"("date");
CREATE INDEX "Sale_createdById_idx" ON "Sale"("createdById");
CREATE INDEX "Sale_paymentMethod_idx" ON "Sale"("paymentMethod");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
