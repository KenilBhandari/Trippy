type FooterProps = {
  fixed?: boolean;
};

function Footer({ fixed = false }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur ${
        fixed ? "fixed inset-x-0 bottom-0 z-50" : ""
      }`}
    >
      <p className="text-center text-sm text-slate-600">
        Made with care in Vadodara by{" "}
        <a
          href="https://kenil-bhandari.vercel.app"
          className="font-semibold underline underline-offset-2 text-slate-800"
        >
          Kenil Bhandari
        </a>{" "}
        ·{" "}
        {year}
      </p>
    </footer>
  );
}

export default Footer;
