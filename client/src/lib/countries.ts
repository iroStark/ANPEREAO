// Lista de países e suas províncias/estados
export interface Country {
  code: string;
  name: string;
  phoneCode: string;
  provinces?: string[];
}

export const countries: Country[] = [
  {
    code: 'AO',
    name: 'Angola',
    phoneCode: '+244',
    provinces: [
      'Bengo',
      'Benguela',
      'Bié',
      'Cabinda',
      'Cuando Cubango',
      'Cuanza Norte',
      'Cuanza Sul',
      'Cunene',
      'Huambo',
      'Huíla',
      'Luanda',
      'Lunda Norte',
      'Lunda Sul',
      'Malanje',
      'Moxico',
      'Namibe',
      'Uíge',
      'Zaire'
    ]
  },
  {
    code: 'PT',
    name: 'Portugal',
    phoneCode: '+351',
    provinces: [
      'Aveiro',
      'Beja',
      'Braga',
      'Bragança',
      'Castelo Branco',
      'Coimbra',
      'Évora',
      'Faro',
      'Guarda',
      'Leiria',
      'Lisboa',
      'Portalegre',
      'Porto',
      'Santarém',
      'Setúbal',
      'Viana do Castelo',
      'Vila Real',
      'Viseu',
      'Açores',
      'Madeira'
    ]
  },
  {
    code: 'BR',
    name: 'Brasil',
    phoneCode: '+55',
    provinces: [
      'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
      'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
      'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
      'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
      'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
    ]
  },
  {
    code: 'MZ',
    name: 'Moçambique',
    phoneCode: '+258',
    provinces: [
      'Cabo Delgado', 'Gaza', 'Inhambane', 'Manica', 'Maputo', 'Maputo Cidade',
      'Nampula', 'Niassa', 'Sofala', 'Tete', 'Zambézia'
    ]
  },
  {
    code: 'CV',
    name: 'Cabo Verde',
    phoneCode: '+238',
    provinces: [
      'Barlavento', 'Sotavento'
    ]
  },
  {
    code: 'ST',
    name: 'São Tomé e Príncipe',
    phoneCode: '+239',
    provinces: [
      'São Tomé', 'Príncipe'
    ]
  },
  {
    code: 'GW',
    name: 'Guiné-Bissau',
    phoneCode: '+245',
    provinces: [
      'Bafatá', 'Biombo', 'Bissau', 'Bolama', 'Cacheu', 'Gabú', 'Oio', 'Quinara', 'Tombali'
    ]
  },
  {
    code: 'ZA',
    name: 'África do Sul',
    phoneCode: '+27',
    provinces: [
      'Cabo Ocidental', 'Cabo Oriental', 'Estado Livre', 'Gauteng', 'KwaZulu-Natal',
      'Limpopo', 'Mpumalanga', 'Norte do Cabo', 'Noroeste'
    ]
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    phoneCode: '+1',
    provinces: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'Califórnia', 'Colorado', 'Connecticut',
      'Delaware', 'Flórida', 'Geórgia', 'Havaí', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
      'Wisconsin', 'Wyoming'
    ]
  },
  {
    code: 'GB',
    name: 'Reino Unido',
    phoneCode: '+44',
    provinces: [
      'Inglaterra', 'Escócia', 'País de Gales', 'Irlanda do Norte'
    ]
  },
  {
    code: 'FR',
    name: 'França',
    phoneCode: '+33',
    provinces: [
      'Alsácia', 'Aquitânia', 'Auvergne', 'Bretanha', 'Burgundy', 'Centre', 'Champagne-Ardenne',
      'Córsega', 'Franche-Comté', 'Île-de-France', 'Languedoc-Roussillon', 'Limousin',
      'Lorraine', 'Midi-Pyrénées', 'Nord-Pas-de-Calais', 'Normandia', 'Pays de la Loire',
      'Picardia', 'Poitou-Charentes', 'Provença-Alpes-Costa Azul', 'Rhône-Alpes'
    ]
  },
  {
    code: 'ES',
    name: 'Espanha',
    phoneCode: '+34',
    provinces: [
      'Andaluzia', 'Aragão', 'Astúrias', 'Baleares', 'País Basco', 'Canárias', 'Cantábria',
      'Castela e Leão', 'Castela-La Mancha', 'Catalunha', 'Extremadura', 'Galiza', 'Madrid',
      'Múrcia', 'Navarra', 'La Rioja', 'Valência'
    ]
  },
  {
    code: 'DE',
    name: 'Alemanha',
    phoneCode: '+49',
    provinces: [
      'Baden-Württemberg', 'Baviera', 'Berlim', 'Brandemburgo', 'Bremen', 'Hamburgo',
      'Hesse', 'Baixa Saxônia', 'Mecklemburgo-Pomerânia Ocidental', 'Renânia do Norte-Vestfália',
      'Renânia-Palatinado', 'Sarre', 'Saxônia', 'Saxônia-Anhalt', 'Schleswig-Holstein', 'Turíngia'
    ]
  },
  {
    code: 'CN',
    name: 'China',
    phoneCode: '+86',
    provinces: [
      'Anhui', 'Fujian', 'Gansu', 'Guangdong', 'Guizhou', 'Hainan', 'Hebei', 'Heilongjiang',
      'Henan', 'Hubei', 'Hunan', 'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'Qinghai',
      'Shaanxi', 'Shandong', 'Shanxi', 'Sichuan', 'Yunnan', 'Zhejiang'
    ]
  },
  {
    code: 'IN',
    name: 'Índia',
    phoneCode: '+91',
    provinces: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
      'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
      'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
      'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ]
  }
];

// Função para obter províncias de um país
export const getProvincesByCountry = (countryCode: string): string[] => {
  const country = countries.find(c => c.code === countryCode);
  return country?.provinces || [];
};

// Função para obter código telefônico de um país
export const getPhoneCodeByCountry = (countryCode: string): string => {
  const country = countries.find(c => c.code === countryCode);
  return country?.phoneCode || '+244';
};

// Função para formatar BI de Angola (formato: 123456789LA123)
export const formatAngolanBI = (value: string): string => {
  // Remove tudo que não é número ou letra
  const cleaned = value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  
  // Se tem menos de 9 caracteres, retorna como está
  if (cleaned.length <= 9) {
    return cleaned;
  }
  
  // Formato: 9 dígitos + 2 letras + 3 dígitos
  if (cleaned.length <= 11) {
    return cleaned.slice(0, 9) + cleaned.slice(9);
  }
  
  // Formato completo: 123456789LA123
  return cleaned.slice(0, 9) + cleaned.slice(9, 11) + cleaned.slice(11, 14);
};

// Validar BI de Angola
export const validateAngolanBI = (bi: string): boolean => {
  const cleaned = bi.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  // Formato: 9 dígitos + 2 letras + 3 dígitos (opcional)
  const biPattern = /^[0-9]{9}[A-Z]{2}[0-9]{0,3}$/;
  return biPattern.test(cleaned) || cleaned.length === 9; // Aceita também só os 9 dígitos
};

