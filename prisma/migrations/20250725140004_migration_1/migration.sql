/*
  Warnings:

  - Added the required column `height` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "height" TEXT NOT NULL,
ADD COLUMN     "width" TEXT NOT NULL,
ADD COLUMN     "x" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "y" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "zIndex" INTEGER NOT NULL DEFAULT 0;
