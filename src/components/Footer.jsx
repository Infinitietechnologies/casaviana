import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-600 text-white w-full py-4 text-center font-bold text-xs md:text-md">
      {t("footer.copyright", { year: currentYear })}
    </footer>
  );
};

export default Footer;