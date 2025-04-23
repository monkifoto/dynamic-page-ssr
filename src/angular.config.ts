interface AngularConfig {
  prerender: {
    routes: string[];
  };
}

const config: AngularConfig = {
  prerender: {
    routes: [
      '/home',
      '/about-us',
      '/services',
      '/contact-us',
      '/gallery',
      '/resident-form',
      '/testimonials',
      '/faq',
      '/location'
    ]
  }
};

export default config;
