import { type output, type ZodType } from "zod";

export const validateSchema = <TSchema extends ZodType>(
  schema: TSchema,
  data: unknown
): output<TSchema> => {
  const res = schema.safeParse(data);

  if (!res.success) throw res.error;

  return res.data;
};
