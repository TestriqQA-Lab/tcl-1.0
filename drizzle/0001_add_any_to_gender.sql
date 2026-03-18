-- Custom SQL migration to add 'ANY' to gender enum
ALTER TYPE "gender" ADD VALUE 'ANY';
