import * as React from "react";
import { formatAngolanBI, validateAngolanBI } from "@/lib/countries";
import { HPHSelect, HPHInput } from "@/components/ui/hph";
import { cn } from "@/lib/utils";

interface IdDocumentInputProps {
  value?: string;
  onChange?: (value: string) => void;
  documentType?: "BI" | "Passaporte";
  onDocumentTypeChange?: (type: "BI" | "Passaporte") => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function IdDocumentInput({
  value = "",
  onChange,
  documentType = "BI",
  onDocumentTypeChange,
  placeholder,
  disabled = false,
  className,
  icon,
}: IdDocumentInputProps) {
  const [documentNumber, setDocumentNumber] = React.useState(value);
  const [docType, setDocType] = React.useState<"BI" | "Passaporte">(documentType);

  React.useEffect(() => {
    setDocumentNumber(value);
  }, [value]);

  React.useEffect(() => {
    setDocType(documentType);
  }, [documentType]);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    if (docType === "BI") {
      // Formatar BI de Angola
      input = formatAngolanBI(input);
    } else {
      // Para passaporte, aceitar letras e números
      input = input.toUpperCase().replace(/[^0-9A-Z]/g, "");
    }
    
    setDocumentNumber(input);
    onChange?.(input);
  };

  const handleTypeChange = (type: "BI" | "Passaporte") => {
    setDocType(type);
    onDocumentTypeChange?.(type);
    // Limpar o campo quando mudar o tipo
    setDocumentNumber("");
    onChange?.("");
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return docType === "BI" ? "123456789LA123" : "A12345678";
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <HPHSelect
        value={docType}
        onChange={(e) => handleTypeChange(e.target.value as "BI" | "Passaporte")}
        disabled={disabled}
        containerClassName="w-[140px]"
        options={[
          { value: "BI", label: "B.I." },
          { value: "Passaporte", label: "Passaporte" }
        ]}
      />
      <HPHInput
        type="text"
        value={documentNumber}
        onChange={handleDocumentChange}
        placeholder={getPlaceholder()}
        disabled={disabled}
        className="flex-1"
        maxLength={docType === "BI" ? 14 : 20}
        icon={icon}
      />
    </div>
  );
}

