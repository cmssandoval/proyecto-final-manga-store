import helmet from 'helmet';

const helmetHandler = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      connectSrc: ["'none'"],
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

export default helmetHandler;
