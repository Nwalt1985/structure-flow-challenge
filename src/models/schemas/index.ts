import { z } from "zod";
import { DateTime } from "luxon";

const parseDateString = (dateStr: string, format: string = "dd/MM/yyyy") => {
  const parsed = DateTime.fromFormat(dateStr, format);
  if (!parsed.isValid) {
    throw new Error(`Date must be in ${format} format`);
  }
  return parsed.toJSDate();
};

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
});

export const companySchema = z.object({
  name: z.string(),
  dateIncorporated: z.string().transform((dateStr) => parseDateString(dateStr)),
  description: z.string(),
  totalEmployees: z.number(),
  employees: z.array(userSchema).optional(),
  address: z.string(),
});

export const updateCompanyUserSchema = z.object({
  user: userSchema,
  companyId: z.string(),
});

export const returnCompanySchema = z.object({
  message: z.string(),
  companyId: z.string(),
  company: companySchema,
});

export type CompanyType = z.infer<typeof companySchema>;
export type UserType = z.infer<typeof userSchema>;
export type UpdateCompanyUserType = z.infer<typeof updateCompanyUserSchema>;
export type ReturnCompanyType = z.infer<typeof returnCompanySchema>;
