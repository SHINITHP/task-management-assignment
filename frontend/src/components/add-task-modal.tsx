import type { AddTaskModalProps } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { UserPlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const fileSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File && file.size > 0, "File is required")
    .refine(
      (file) =>
        file instanceof File &&
        [
          "text/csv",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ].includes(file.type),
      "Only CSV, XLSX, or XLS files allowed"
    ),
});

type FileFormData = z.infer<typeof fileSchema>;

const AddTaskModal = ({ open, onOpenChange, onSave }: AddTaskModalProps) => {
  const form = useForm<FileFormData>({
    resolver: zodResolver(fileSchema),
  });

  const onSubmit = async (data: FileFormData) => {
    onSave(data.file);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg dark:bg-[#1a1a1a] animate-fade-in border border-border shadow-glow animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <UserPlus className="h-5 w-5 text-primary" />
            Add Task
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new agent to join your team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-6"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Upload CSV / XLSX / XLS</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              className="w-full"
              type="submit"
            >
              Upload and Distribute
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
