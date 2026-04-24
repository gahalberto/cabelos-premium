"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveSEOConfig, saveTrackingConfig, saveProductSEO } from "@/app/_actions/admin/seo/save-seo-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Tag,
  Code2,
  Package,
  Info,
  CheckCircle2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Page { id: string; label: string }
interface SEOConfigRecord {
  id: string; metaTitle?: string | null; metaDescription?: string | null;
  ogImage?: string | null; keywords?: string | null; noIndex?: boolean;
}
interface StoreConfigRecord {
  gtmId?: string | null; ga4Id?: string | null; metaPixelId?: string | null;
  customHeadScripts?: string | null; customBodyScripts?: string | null; robotsContent?: string | null;
}
interface ProductRecord {
  id: string; name: string; slug: string; metaTitle?: string | null;
  metaDescription?: string | null; keywords?: string | null;
  ogImage?: string | null; canonicalUrl?: string | null;
}

interface Props {
  pages: Page[];
  seoConfigMap: Record<string, SEOConfigRecord>;
  storeConfig: StoreConfigRecord | null;
  products: ProductRecord[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const color = len > max ? "text-red-500" : len > max * 0.9 ? "text-amber-500" : "text-gray-400";
  return <span className={`text-xs ${color}`}>{len}/{max}</span>;
}

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="font-medium">{label}</Label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {children}
    </div>
  );
}

// ─── Aba: SEO por Página ──────────────────────────────────────────────────────

function PageSEOTab({ pages, seoConfigMap }: { pages: Page[]; seoConfigMap: Record<string, SEOConfigRecord> }) {
  const [selectedPage, setSelectedPage] = useState(pages[0].id);
  const [isPending, startTransition] = useTransition();

  const current = seoConfigMap[selectedPage] ?? {};
  const [form, setForm] = useState<Record<string, { metaTitle: string; metaDescription: string; ogImage: string; keywords: string; noIndex: boolean }>>(() =>
    Object.fromEntries(pages.map((p) => [
      p.id,
      {
        metaTitle: seoConfigMap[p.id]?.metaTitle ?? "",
        metaDescription: seoConfigMap[p.id]?.metaDescription ?? "",
        ogImage: seoConfigMap[p.id]?.ogImage ?? "",
        keywords: seoConfigMap[p.id]?.keywords ?? "",
        noIndex: seoConfigMap[p.id]?.noIndex ?? false,
      },
    ]))
  );

  const values = form[selectedPage];
  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [selectedPage]: { ...prev[selectedPage], [field]: value } }));

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveSEOConfig({ id: selectedPage, ...values });
        toast.success("SEO salvo com sucesso!");
      } catch (e: any) {
        toast.error(e.message ?? "Erro ao salvar");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Página</Label>
        <Select value={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pages.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-5">
        <FieldGroup label="Meta Title" hint="Ideal: 50–60 caracteres. Aparece na aba do navegador e no Google.">
          <div className="flex items-center gap-2">
            <Input value={values.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} maxLength={70} placeholder="Ex: Mega Hair Natural | Cabelos Premium" />
            <CharCounter value={values.metaTitle} max={60} />
          </div>
        </FieldGroup>

        <FieldGroup label="Meta Description" hint="Ideal: 140–160 caracteres. Aparece no snippet do Google.">
          <div className="space-y-1">
            <Textarea value={values.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} maxLength={200} rows={3} placeholder="Descreva esta página com sua keyword principal no início." />
            <CharCounter value={values.metaDescription} max={160} />
          </div>
        </FieldGroup>

        <FieldGroup label="Palavras-chave (separadas por vírgula)" hint="Uso interno e para gerar tags keywords. O Google não as usa para ranking, mas auxiliam ferramentas internas.">
          <Input value={values.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="extensões capilares, mega hair, laces" />
        </FieldGroup>

        <FieldGroup label="Imagem Open Graph (URL)" hint="Aparece quando a página é compartilhada no WhatsApp, Facebook, etc. Tamanho ideal: 1200×630px.">
          <Input value={values.ogImage} onChange={(e) => set("ogImage", e.target.value)} placeholder="https://cabelospremium.com.br/images/og-home.jpg" />
        </FieldGroup>

        <div className="flex items-center gap-3">
          <Checkbox
            id="noindex"
            checked={values.noIndex}
            onCheckedChange={(v) => set("noIndex", Boolean(v))}
          />
          <Label htmlFor="noindex" className="cursor-pointer">
            noindex — ocultar esta página do Google
          </Label>
        </div>
      </div>

      <Button onClick={handleSave} disabled={isPending} className="bg-amber-600 hover:bg-amber-700 text-white">
        {isPending ? "Salvando…" : "Salvar SEO desta página"}
      </Button>
    </div>
  );
}

// ─── Aba: Scripts de Rastreamento ─────────────────────────────────────────────

function TrackingTab({ initial }: { initial: StoreConfigRecord | null }) {
  const [isPending, startTransition] = useTransition();
  const [gtmId, setGtmId] = useState(initial?.gtmId ?? "");
  const [ga4Id, setGa4Id] = useState(initial?.ga4Id ?? "");
  const [metaPixelId, setMetaPixelId] = useState(initial?.metaPixelId ?? "");
  const [customHead, setCustomHead] = useState(initial?.customHeadScripts ?? "");
  const [customBody, setCustomBody] = useState(initial?.customBodyScripts ?? "");
  const [robotsContent, setRobotsContent] = useState(initial?.robotsContent ?? "");

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveTrackingConfig({
          gtmId: gtmId || undefined,
          ga4Id: ga4Id || undefined,
          metaPixelId: metaPixelId || undefined,
          customHeadScripts: customHead || undefined,
          customBodyScripts: customBody || undefined,
          robotsContent: robotsContent || undefined,
        });
        toast.success("Configurações de rastreamento salvas!");
      } catch (e: any) {
        toast.error(e.message ?? "Erro ao salvar");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 flex gap-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <span>Se você usar GTM, <strong>não preencha</strong> o GA4 ID aqui — configure ambos via GTM. O Meta Pixel pode ser configurado independentemente.</span>
      </div>

      <div className="grid gap-5">
        <FieldGroup label="Google Tag Manager ID" hint="Formato: GTM-XXXXXXX">
          <Input value={gtmId} onChange={(e) => setGtmId(e.target.value)} placeholder="GTM-XXXXXXX" />
        </FieldGroup>

        <FieldGroup label="Google Analytics 4 (GA4) Measurement ID" hint="Usar apenas se não tiver GTM. Formato: G-XXXXXXXXXX">
          <Input value={ga4Id} onChange={(e) => setGa4Id(e.target.value)} placeholder="G-XXXXXXXXXX" />
        </FieldGroup>

        <FieldGroup label="Meta Pixel ID" hint="Formato: número (ex: 1234567890)">
          <Input value={metaPixelId} onChange={(e) => setMetaPixelId(e.target.value)} placeholder="1234567890" />
        </FieldGroup>

        <FieldGroup label="Scripts customizados no <head>" hint="Cole scripts de terceiros que devem ir no head (ex: Microsoft Clarity, Hotjar, etc.)">
          <Textarea value={customHead} onChange={(e) => setCustomHead(e.target.value)} rows={5} className="font-mono text-xs" placeholder="<!-- Cole aqui scripts para o <head> -->" />
        </FieldGroup>

        <FieldGroup label="Scripts customizados no <body>" hint="Scripts que devem ser injetados no final do body.">
          <Textarea value={customBody} onChange={(e) => setCustomBody(e.target.value)} rows={5} className="font-mono text-xs" placeholder="<!-- Cole aqui scripts para o <body> -->" />
        </FieldGroup>

        <FieldGroup label="robots.txt customizado" hint="Deixe em branco para usar o padrão. Alterações entram em vigor no próximo deploy ou revalidação.">
          <Textarea value={robotsContent} onChange={(e) => setRobotsContent(e.target.value)} rows={8} className="font-mono text-xs" placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://cabelospremium.com.br/sitemap.xml`} />
        </FieldGroup>
      </div>

      <Button onClick={handleSave} disabled={isPending} className="bg-amber-600 hover:bg-amber-700 text-white">
        {isPending ? "Salvando…" : "Salvar configurações de rastreamento"}
      </Button>
    </div>
  );
}

// ─── Aba: SEO de Produtos ─────────────────────────────────────────────────────

function ProductSEOTab({ products }: { products: ProductRecord[] }) {
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<Record<string, { metaTitle: string; metaDescription: string; keywords: string; ogImage: string; canonicalUrl: string }>>(() =>
    Object.fromEntries(products.map((p) => [
      p.id,
      {
        metaTitle: p.metaTitle ?? "",
        metaDescription: p.metaDescription ?? "",
        keywords: p.keywords ?? "",
        ogImage: p.ogImage ?? "",
        canonicalUrl: p.canonicalUrl ?? "",
      },
    ]))
  );

  const values = form[selectedId] ?? { metaTitle: "", metaDescription: "", keywords: "", ogImage: "", canonicalUrl: "" };
  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [selectedId]: { ...prev[selectedId], [field]: value } }));

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveProductSEO({ productId: selectedId, ...values });
        toast.success("SEO do produto salvo!");
      } catch (e: any) {
        toast.error(e.message ?? "Erro ao salvar");
      }
    });
  };

  if (products.length === 0) return <p className="text-gray-500">Nenhum produto ativo encontrado.</p>;

  const selected = products.find((p) => p.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Produto</Label>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  {p.metaTitle ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <span className="h-3 w-3" />}
                  {p.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected && (
          <p className="text-xs text-gray-500 mt-1">URL: /{selected.slug}</p>
        )}
      </div>

      <div className="grid gap-5">
        <FieldGroup label="Meta Title" hint="Deixe em branco para usar o nome do produto automaticamente. Ideal: 50–60 caracteres.">
          <div className="flex items-center gap-2">
            <Input value={values.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} maxLength={70} placeholder={`${selected?.name} | Cabelos Premium`} />
            <CharCounter value={values.metaTitle} max={60} />
          </div>
        </FieldGroup>

        <FieldGroup label="Meta Description" hint="Deixe em branco para usar a descrição do produto. Ideal: 140–160 caracteres.">
          <div className="space-y-1">
            <Textarea value={values.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} maxLength={200} rows={3} placeholder="Compre... com qualidade premium. Entrega para todo o Brasil." />
            <CharCounter value={values.metaDescription} max={160} />
          </div>
        </FieldGroup>

        <FieldGroup label="Palavras-chave" hint="Separadas por vírgula.">
          <Input value={values.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="mega hair, extensão, cabelo natural" />
        </FieldGroup>

        <FieldGroup label="Imagem Open Graph (URL)" hint="Sobrescreve a primeira foto do produto no compartilhamento social.">
          <Input value={values.ogImage} onChange={(e) => set("ogImage", e.target.value)} placeholder="https://..." />
        </FieldGroup>

        <FieldGroup label="URL Canônica" hint="Usar apenas se este produto duplicar o conteúdo de outra URL. Deixe em branco para o padrão.">
          <Input value={values.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} placeholder="https://cabelospremium.com.br/mega-hair-natural" />
        </FieldGroup>
      </div>

      <Button onClick={handleSave} disabled={isPending} className="bg-amber-600 hover:bg-amber-700 text-white">
        {isPending ? "Salvando…" : "Salvar SEO do produto"}
      </Button>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export function SEOAdminForm({ pages, seoConfigMap, storeConfig, products }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
        <strong>Painel SEO — Cabelos Premium</strong><br />
        Configure Meta Titles, Descriptions, Open Graph, rastreamento e dados por produto. Alterações são aplicadas em tempo real via ISR.
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pages" className="flex items-center gap-1">
            <Globe className="h-4 w-4" /> Páginas
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-1">
            <Code2 className="h-4 w-4" /> Rastreamento
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-1">
            <Package className="h-4 w-4" /> Produtos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Tag className="h-5 w-5 text-amber-600" /> SEO por Página
          </h2>
          <PageSEOTab pages={pages} seoConfigMap={seoConfigMap} />
        </TabsContent>

        <TabsContent value="tracking" className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-amber-600" /> Scripts de Rastreamento & robots.txt
          </h2>
          <TrackingTab initial={storeConfig} />
        </TabsContent>

        <TabsContent value="products" className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Package className="h-5 w-5 text-amber-600" /> SEO Individual de Produtos
          </h2>
          <ProductSEOTab products={products} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
