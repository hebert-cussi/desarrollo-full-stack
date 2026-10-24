-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK');

-- CreateEnum
CREATE TYPE "AreaTecnologia" AS ENUM ('FRONTEND', 'BACKEND', 'BASE_DATOS', 'HERRAMIENTA');

-- CreateTable
CREATE TABLE "proyectos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '💻',
    "categoria" "Categoria" NOT NULL,
    "urlDemo" TEXT,
    "urlRepo" TEXT,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tecnologias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "area" "AreaTecnologia" NOT NULL,

    CONSTRAINT "tecnologias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "servicio" TEXT,
    "presupuesto" INTEGER,
    "fecha" DATE,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProyectoToTecnologia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProyectoToTecnologia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tecnologias_nombre_key" ON "tecnologias"("nombre");

-- CreateIndex
CREATE INDEX "_ProyectoToTecnologia_B_index" ON "_ProyectoToTecnologia"("B");

-- AddForeignKey
ALTER TABLE "_ProyectoToTecnologia" ADD CONSTRAINT "_ProyectoToTecnologia_A_fkey" FOREIGN KEY ("A") REFERENCES "proyectos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProyectoToTecnologia" ADD CONSTRAINT "_ProyectoToTecnologia_B_fkey" FOREIGN KEY ("B") REFERENCES "tecnologias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
