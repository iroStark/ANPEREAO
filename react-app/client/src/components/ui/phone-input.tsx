import * as React from "react";
import { countries, getPhoneCodeByCountry, type Country } from "@/lib/countries";
import { HPHSelect, HPHInput } from "@/components/ui/hph";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  countryCode?: string;
  onCountryChange?: (countryCode: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function PhoneInput({
  value = "",
  onChange,
  countryCode = "AO",
  onCountryChange,
  placeholder = "923 456 789",
  disabled = false,
  className,
  icon,
}: PhoneInputProps) {
  // Extrair o número do telefone do value (remover código do país se presente)
  const extractPhoneNumber = (phoneValue: string, currentCountryCode: string): string => {
    if (!phoneValue) return "";
    // Remove código do país se presente (formato +XXX...)
    const phoneCode = getPhoneCodeByCountry(currentCountryCode);
    if (phoneValue.startsWith(phoneCode)) {
      return phoneValue.substring(phoneCode.length);
    }
    // Tenta remover qualquer código de país conhecido
    for (const country of countries) {
      if (phoneValue.startsWith(country.phoneCode)) {
        return phoneValue.substring(country.phoneCode.length);
      }
    }
    // Se não começa com código conhecido, assume que já é só o número
    return phoneValue.replace(/\D/g, "");
  };

  const [phoneNumber, setPhoneNumber] = React.useState(() => extractPhoneNumber(value, countryCode));
  const [selectedCountry, setSelectedCountry] = React.useState(countryCode);

  React.useEffect(() => {
    // Quando o value externo muda, extrair apenas o número usando o país selecionado
    if (value) {
      const extracted = extractPhoneNumber(value, selectedCountry);
      // Só atualiza se o número extraído for diferente do atual (evita loops)
      if (extracted !== phoneNumber) {
        setPhoneNumber(extracted);
      }
    } else {
      setPhoneNumber("");
    }
  }, [value]);

  React.useEffect(() => {
    if (countryCode !== selectedCountry) {
      setSelectedCountry(countryCode);
      // Quando o país muda externamente, re-extrair o número
      if (value) {
        const extracted = extractPhoneNumber(value, countryCode);
        setPhoneNumber(extracted);
      }
    }
  }, [countryCode]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
    setPhoneNumber(input);
    const phoneCode = getPhoneCodeByCountry(selectedCountry);
    // Sempre adiciona o código do país ao número digitado
    onChange?.(`${phoneCode}${input}`);
  };

  const handleCountryChange = (newCountryCode: string) => {
    setSelectedCountry(newCountryCode);
    onCountryChange?.(newCountryCode);
    const phoneCode = getPhoneCodeByCountry(newCountryCode);
    // Manter o número atual, apenas atualizar o código do país
    onChange?.(`${phoneCode}${phoneNumber}`);
  };

  const selectedCountryData = countries.find(c => c.code === selectedCountry);
  const phoneCode = selectedCountryData?.phoneCode || "+244";

  return (
    <div className={cn("flex gap-2", className)}>
      <HPHSelect 
        value={selectedCountry} 
        onChange={(e) => handleCountryChange(e.target.value)} 
        disabled={disabled}
        containerClassName="w-[140px]"
        options={countries.map((country) => ({
          value: country.code,
          label: `${country.phoneCode} ${country.name}`
        }))}
      />
      <HPHInput
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
        icon={icon}
      />
    </div>
  );
}

