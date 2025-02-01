# ============== Stage 1 ================
FROM mahdad1988/node20-chromium:v1.0.0 As base

RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy and install dependencies first to leverage Docker cache
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY apps/file apps/file

RUN PUPPETEER_SKIP_DOWNLOAD=true pnpm install -r

# ============== Stage 2 ================
FROM base As builder

COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/file apps/file
COPY libs libs

RUN mkdir -p /usr/src/values/invoices_temporary

ENV INVOICE_GENERATE_TEMPORARY_PATH=/usr/src/values/invoices_temporary

RUN pnpm run build file

# ============== Stage 3 ================
FROM mahdad1988/node20-chromium:v1.0.0 as production

ARG NODE_ENV=production
ENV NODE=${NODE_ENV}

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./dist/apps/file/node_modules
COPY --from=builder /usr/src/app/apps/file/src/invoice/pdf-generator/templates /usr/src/templates

RUN mkdir -p /usr/src/values/invoices_temporary

ENV INVOICE_GENERATE_TEMPORARY_PATH=/usr/src/values/invoices_temporary
ENV INVOICE_TEMPLATE_PATH=/usr/src/templates

CMD [ "node", "dist/apps/file/main" ]
