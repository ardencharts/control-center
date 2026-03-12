-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3),
    "currency" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "actual" TEXT NOT NULL,
    "forecast" TEXT NOT NULL,
    "previous" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartDataMetaInfo" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "symbol" TEXT NOT NULL,
    "resolution" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "client" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChartDataMetaInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartDrawing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "drawingType" TEXT NOT NULL,
    "points" JSONB NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#000000',
    "lineWidth" INTEGER NOT NULL DEFAULT 2,
    "lineStyle" TEXT NOT NULL DEFAULT 'solid',
    "lineSpacing" INTEGER NOT NULL DEFAULT 0,
    "text" TEXT,
    "fontSize" INTEGER,
    "textWidth" INTEGER,
    "textHeight" INTEGER,
    "isComplete" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChartDrawing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartLayout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "chartPanels" JSONB NOT NULL,
    "indicators" JSONB,
    "theme" TEXT,
    "timeframe" TEXT,
    "symbols" JSONB,
    "gridLayout" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "sharedWithUsers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChartLayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinMarketCap" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "volume24h" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "marketCap" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "percentChange1h" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "percentChange24h" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "percentChange7d" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "circulatingSupply" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "maxSupply" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalSupply" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "infiniteSupply" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT DEFAULT '',

    CONSTRAINT "CoinMarketCap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Earning" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "epsActual" DOUBLE PRECISION,
    "epsEstimate" DOUBLE PRECISION,
    "hour" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "revenueActual" DOUBLE PRECISION,
    "revenueEstimate" DOUBLE PRECISION,
    "symbol" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Earning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Earnings" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "earnings_id" TEXT NOT NULL,
    "company_name" TEXT,
    "report_date" TIMESTAMP(3),
    "fiscal_period" TEXT,
    "fiscal_year" INTEGER,
    "actual_eps" DOUBLE PRECISION,
    "estimated_eps" DOUBLE PRECISION,
    "surprise_eps" DOUBLE PRECISION,
    "surprise_eps_percent" DOUBLE PRECISION,
    "actual_revenue" BIGINT,
    "estimated_revenue" BIGINT,
    "surprise_revenue" BIGINT,
    "surprise_revenue_percent" DOUBLE PRECISION,
    "updated_date" TIMESTAMP(3),
    "reporting_status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquityAddress" (
    "id" SERIAL NOT NULL,
    "address1" TEXT DEFAULT 'NA',
    "address2" TEXT DEFAULT 'NA',
    "city" TEXT DEFAULT 'NA',
    "state" TEXT DEFAULT 'NA',
    "postal_code" TEXT DEFAULT 'NA',
    "country" TEXT DEFAULT 'NA',
    "ticker" TEXT NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EquityAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquityBranding" (
    "id" SERIAL NOT NULL,
    "logo_url" TEXT DEFAULT 'NA',
    "icon_url" TEXT DEFAULT 'NA',
    "ticker" TEXT NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EquityBranding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquityDetails" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "cik" TEXT DEFAULT 'NA',
    "composite_figi" TEXT DEFAULT 'NA',
    "currency_name" TEXT DEFAULT 'NA',
    "delisted_utc" TEXT DEFAULT 'NA',
    "description" TEXT DEFAULT 'NA',
    "homepage_url" TEXT DEFAULT 'NA',
    "list_date" TEXT DEFAULT 'NA',
    "locale" TEXT DEFAULT 'NA',
    "market" TEXT DEFAULT 'NA',
    "market_cap" DECIMAL(65,30) DEFAULT 0,
    "name" TEXT DEFAULT 'NA',
    "phone_number" TEXT DEFAULT 'NA',
    "primary_exchange" TEXT DEFAULT 'NA',
    "round_lot" DECIMAL(65,30) DEFAULT 0,
    "share_class_figi" TEXT DEFAULT 'NA',
    "share_class_shares_outstanding" DECIMAL(65,30) DEFAULT 0,
    "sic_code" TEXT DEFAULT 'NA',
    "sic_description" TEXT DEFAULT 'NA',
    "ticker" TEXT NOT NULL,
    "ticker_root" TEXT DEFAULT 'NA',
    "ticker_suffix" TEXT DEFAULT 'NA',
    "total_employees" DECIMAL(65,30) DEFAULT 0,
    "type" TEXT DEFAULT 'NA',
    "weighted_shares_outstanding" DECIMAL(65,30) DEFAULT 0,
    "status" TEXT DEFAULT 'NA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EquityDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquityDividend" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "dividend_id" TEXT NOT NULL,
    "cash_amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT,
    "declaration_date" TIMESTAMP(3),
    "dividend_type" TEXT NOT NULL,
    "ex_dividend_date" TIMESTAMP(3) NOT NULL,
    "frequency" INTEGER NOT NULL,
    "pay_date" TIMESTAMP(3),
    "record_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EquityDividend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquityFinancialReport" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "cik" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "filingDate" TIMESTAMP(3) NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "fiscalPeriod" TEXT NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "netIncome" DOUBLE PRECISION,
    "totalRevenue" DOUBLE PRECISION,
    "grossProfit" DOUBLE PRECISION,
    "totalAssets" DOUBLE PRECISION,
    "totalLiabilities" DOUBLE PRECISION,
    "equity" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EquityFinancialReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquitySplit" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "split_id" TEXT NOT NULL,
    "execution_date" TIMESTAMP(3) NOT NULL,
    "split_from" DOUBLE PRECISION NOT NULL,
    "split_to" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EquitySplit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquityTicker" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "cik" TEXT NOT NULL DEFAULT 'NA',
    "composite_figi" TEXT NOT NULL DEFAULT 'NA',
    "currency_name" TEXT NOT NULL DEFAULT 'NA',
    "last_updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale" TEXT NOT NULL DEFAULT 'NA',
    "market" TEXT NOT NULL DEFAULT 'NA',
    "name" TEXT NOT NULL DEFAULT 'NA',
    "primary_exchange" TEXT NOT NULL DEFAULT 'NA',
    "share_class_figi" TEXT NOT NULL DEFAULT 'NA',
    "ticker" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EquityTicker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquityType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'NA',
    "asset_class" TEXT NOT NULL DEFAULT 'NA',
    "locale" TEXT NOT NULL DEFAULT 'NA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EquityType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "exchange" TEXT NOT NULL DEFAULT 'NA',
    "symbol" TEXT NOT NULL DEFAULT 'NA',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketHoliday" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "exchange" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "open_time" TEXT,
    "close_time" TEXT,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MarketHoliday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketSnapshot" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "market_status" TEXT,
    "fmv" DOUBLE PRECISION,
    "day_change" DOUBLE PRECISION,
    "day_change_percent" DOUBLE PRECISION,
    "early_trading_change" DOUBLE PRECISION,
    "early_trading_change_percent" DOUBLE PRECISION,
    "last_quote_time" BIGINT,
    "last_trade_time" BIGINT,
    "min_todayc" DOUBLE PRECISION,
    "max_todayc" DOUBLE PRECISION,
    "prev_day_close" DOUBLE PRECISION,
    "updated_timestamp" BIGINT,
    "volume" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MarketSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketStatus" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "session" TEXT NOT NULL DEFAULT 'CLOSE',
    "dailyOpen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dailyClose" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preMarketOpen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marketOpen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marketClose" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "afterMarketClose" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MarketStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "totalValue" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalGain" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalReturn" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "averagePrice" DECIMAL(65,30) NOT NULL,
    "currentPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "purchaseNotes" TEXT,
    "totalCost" DECIMAL(65,30) NOT NULL,
    "currentValue" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unrealizedGain" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unrealizedReturn" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lastPriceUpdate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PortfolioHolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioTransaction" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "commission" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PortfolioTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "targetPrice" DECIMAL(65,30) NOT NULL,
    "condition" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "triggered" BOOLEAN NOT NULL DEFAULT false,
    "triggeredAt" TIMESTAMP(3),
    "triggerPrice" DECIMAL(65,30),
    "message" TEXT,
    "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "repeatAlert" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PriceAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortInterest" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "market" TEXT,
    "settlement_date" TIMESTAMP(3) NOT NULL,
    "short_interest" BIGINT,
    "short_interest_change" BIGINT,
    "short_interest_ratio" DOUBLE PRECISION,
    "days_to_cover" DOUBLE PRECISION,
    "revision_flag" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShortInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortVolume" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "market" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "short_volume" BIGINT,
    "short_exempt_volume" BIGINT,
    "total_volume" BIGINT,
    "short_volume_percent" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShortVolume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyTemplateDataMetaInfo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "client" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StudyTemplateDataMetaInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticker" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "symbol" TEXT NOT NULL DEFAULT 'NA',
    "exchange" TEXT NOT NULL DEFAULT 'NA',
    "type" TEXT NOT NULL DEFAULT 'NA',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "epoch" BIGINT NOT NULL DEFAULT 0,
    "bidPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "askPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "spread" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "marketOpenDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marketCloseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dailyOpenPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyChange" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyPercentChange" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "session" TEXT NOT NULL DEFAULT 'CLOSE',
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Ticker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TickerSubscription" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "symbol" TEXT NOT NULL DEFAULT 'NA',
    "marketSymbol" TEXT NOT NULL DEFAULT 'NA',
    "exchange" TEXT NOT NULL DEFAULT 'NA',
    "type" TEXT NOT NULL DEFAULT 'NA',
    "description" TEXT NOT NULL DEFAULT 'NA',
    "name" TEXT NOT NULL DEFAULT 'NA',
    "base" TEXT NOT NULL DEFAULT 'NA',
    "quote" TEXT NOT NULL DEFAULT 'NA',
    "tradable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "subType" TEXT NOT NULL DEFAULT '',
    "change" DECIMAL(65,30),
    "changePercent" DECIMAL(65,30),
    "last" DECIMAL(65,30),
    "volume" DECIMAL(65,30),

    CONSTRAINT "TickerSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAlertPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "defaultSoundType" TEXT NOT NULL DEFAULT 'beep',
    "soundVolume" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "emailOnTrigger" BOOLEAN NOT NULL DEFAULT false,
    "emailOnExpiry" BOOLEAN NOT NULL DEFAULT false,
    "maxAlertsPerSymbol" INTEGER NOT NULL DEFAULT 10,
    "autoDeleteTriggered" BOOLEAN NOT NULL DEFAULT false,
    "autoDeleteExpired" BOOLEAN NOT NULL DEFAULT true,
    "repeatDelayMinutes" INTEGER NOT NULL DEFAULT 5,
    "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "weekendAlertsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAlertPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDrawingPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "defaultDrawingColor" TEXT NOT NULL DEFAULT '#2563eb',
    "defaultLineWidth" INTEGER NOT NULL DEFAULT 2,
    "defaultLineStyle" TEXT NOT NULL DEFAULT 'solid',
    "defaultLineSpacing" INTEGER NOT NULL DEFAULT 0,
    "defaultFontSize" INTEGER NOT NULL DEFAULT 14,
    "magnetModeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "continuousDrawing" BOOLEAN NOT NULL DEFAULT false,
    "showDrawingToolbar" BOOLEAN NOT NULL DEFAULT true,
    "drawingOpacity" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "snapToPrice" BOOLEAN NOT NULL DEFAULT true,
    "snapToTime" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDrawingPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "currentSymbol" TEXT NOT NULL,
    "currentTimeframe" INTEGER NOT NULL,
    "themeMode" TEXT NOT NULL,
    "themeStretch" TEXT NOT NULL,
    "themeContrast" TEXT NOT NULL,
    "themeDirection" TEXT NOT NULL,
    "themeColorPreset" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL,
    "watchlistId" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "displayName" TEXT,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "alertsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_id_key" ON "Calendar"("id");

-- CreateIndex
CREATE INDEX "Calendar_currency_impact_day_time_idx" ON "Calendar"("currency", "impact", "day", "time");

-- CreateIndex
CREATE UNIQUE INDEX "ChartDataMetaInfo_id_key" ON "ChartDataMetaInfo"("id");

-- CreateIndex
CREATE INDEX "ChartDataMetaInfo_client_user_idx" ON "ChartDataMetaInfo"("client", "user");

-- CreateIndex
CREATE INDEX "ChartDrawing_userId_createdAt_idx" ON "ChartDrawing"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ChartDrawing_userId_exchange_symbol_interval_idx" ON "ChartDrawing"("userId", "exchange", "symbol", "interval");

-- CreateIndex
CREATE UNIQUE INDEX "ChartDrawing_id_userId_key" ON "ChartDrawing"("id", "userId");

-- CreateIndex
CREATE INDEX "ChartLayout_isPublic_idx" ON "ChartLayout"("isPublic");

-- CreateIndex
CREATE INDEX "ChartLayout_userId_createdAt_idx" ON "ChartLayout"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ChartLayout_userId_isDefault_idx" ON "ChartLayout"("userId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "ChartLayout_userId_name_key" ON "ChartLayout"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CoinMarketCap_symbol_key" ON "CoinMarketCap"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Earning_id_key" ON "Earning"("id");

-- CreateIndex
CREATE INDEX "Earning_symbol_date_idx" ON "Earning"("symbol", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Earnings_earnings_id_key" ON "Earnings"("earnings_id");

-- CreateIndex
CREATE INDEX "Earnings_fiscal_year_fiscal_period_idx" ON "Earnings"("fiscal_year", "fiscal_period");

-- CreateIndex
CREATE INDEX "Earnings_report_date_idx" ON "Earnings"("report_date");

-- CreateIndex
CREATE INDEX "Earnings_ticker_idx" ON "Earnings"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "EquityAddress_ticker_key" ON "EquityAddress"("ticker");

-- CreateIndex
CREATE INDEX "EquityAddress_ticker_idx" ON "EquityAddress"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "EquityBranding_ticker_key" ON "EquityBranding"("ticker");

-- CreateIndex
CREATE INDEX "EquityBranding_ticker_idx" ON "EquityBranding"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "EquityDetails_ticker_key" ON "EquityDetails"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "EquityDividend_dividend_id_key" ON "EquityDividend"("dividend_id");

-- CreateIndex
CREATE INDEX "EquityDividend_ticker_ex_dividend_date_idx" ON "EquityDividend"("ticker", "ex_dividend_date");

-- CreateIndex
CREATE UNIQUE INDEX "EquityFinancialReport_key_key" ON "EquityFinancialReport"("key");

-- CreateIndex
CREATE UNIQUE INDEX "EquitySplit_split_id_key" ON "EquitySplit"("split_id");

-- CreateIndex
CREATE INDEX "EquitySplit_ticker_execution_date_idx" ON "EquitySplit"("ticker", "execution_date");

-- CreateIndex
CREATE UNIQUE INDEX "EquityTicker_ticker_key" ON "EquityTicker"("ticker");

-- CreateIndex
CREATE INDEX "EquityTicker_ticker_type_market_idx" ON "EquityTicker"("ticker", "type", "market");

-- CreateIndex
CREATE UNIQUE INDEX "EquityType_code_key" ON "EquityType"("code");

-- CreateIndex
CREATE INDEX "EquityType_code_locale_idx" ON "EquityType"("code", "locale");

-- CreateIndex
CREATE INDEX "History_exchange_symbol_idx" ON "History"("exchange", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "MarketHoliday_key_key" ON "MarketHoliday"("key");

-- CreateIndex
CREATE INDEX "MarketHoliday_date_exchange_idx" ON "MarketHoliday"("date", "exchange");

-- CreateIndex
CREATE UNIQUE INDEX "MarketSnapshot_ticker_key" ON "MarketSnapshot"("ticker");

-- CreateIndex
CREATE INDEX "MarketSnapshot_ticker_updated_timestamp_idx" ON "MarketSnapshot"("ticker", "updated_timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "MarketStatus_type_key" ON "MarketStatus"("type");

-- CreateIndex
CREATE INDEX "Portfolio_userId_createdAt_idx" ON "Portfolio"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Portfolio_userId_isDefault_idx" ON "Portfolio"("userId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_name_key" ON "Portfolio"("userId", "name");

-- CreateIndex
CREATE INDEX "PortfolioHolding_assetType_idx" ON "PortfolioHolding"("assetType");

-- CreateIndex
CREATE INDEX "PortfolioHolding_exchange_symbol_idx" ON "PortfolioHolding"("exchange", "symbol");

-- CreateIndex
CREATE INDEX "PortfolioHolding_portfolioId_idx" ON "PortfolioHolding"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioHolding_portfolioId_exchange_symbol_key" ON "PortfolioHolding"("portfolioId", "exchange", "symbol");

-- CreateIndex
CREATE INDEX "PortfolioTransaction_portfolioId_idx" ON "PortfolioTransaction"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfolioTransaction_portfolioId_symbol_idx" ON "PortfolioTransaction"("portfolioId", "symbol");

-- CreateIndex
CREATE INDEX "PortfolioTransaction_transactionDate_idx" ON "PortfolioTransaction"("transactionDate");

-- CreateIndex
CREATE INDEX "PortfolioTransaction_type_idx" ON "PortfolioTransaction"("type");

-- CreateIndex
CREATE INDEX "PriceAlert_exchange_symbol_enabled_idx" ON "PriceAlert"("exchange", "symbol", "enabled");

-- CreateIndex
CREATE INDEX "PriceAlert_triggeredAt_idx" ON "PriceAlert"("triggeredAt");

-- CreateIndex
CREATE INDEX "PriceAlert_userId_createdAt_idx" ON "PriceAlert"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PriceAlert_userId_enabled_triggered_idx" ON "PriceAlert"("userId", "enabled", "triggered");

-- CreateIndex
CREATE INDEX "ShortInterest_ticker_settlement_date_idx" ON "ShortInterest"("ticker", "settlement_date");

-- CreateIndex
CREATE UNIQUE INDEX "ShortInterest_ticker_settlement_date_key" ON "ShortInterest"("ticker", "settlement_date");

-- CreateIndex
CREATE INDEX "ShortVolume_date_idx" ON "ShortVolume"("date");

-- CreateIndex
CREATE INDEX "ShortVolume_ticker_date_idx" ON "ShortVolume"("ticker", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ShortVolume_ticker_market_date_key" ON "ShortVolume"("ticker", "market", "date");

-- CreateIndex
CREATE INDEX "StudyTemplateDataMetaInfo_client_user_idx" ON "StudyTemplateDataMetaInfo"("client", "user");

-- CreateIndex
CREATE UNIQUE INDEX "StudyTemplateDataMetaInfo_name_user_client_key" ON "StudyTemplateDataMetaInfo"("name", "user", "client");

-- CreateIndex
CREATE UNIQUE INDEX "Ticker_key_key" ON "Ticker"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TickerSubscription_key_key" ON "TickerSubscription"("key");

-- CreateIndex
CREATE INDEX "TickerSubscription_symbol_exchange_type_idx" ON "TickerSubscription"("symbol", "exchange", "type");

-- CreateIndex
CREATE UNIQUE INDEX "UserAlertPreferences_userId_key" ON "UserAlertPreferences"("userId");

-- CreateIndex
CREATE INDEX "UserAlertPreferences_userId_idx" ON "UserAlertPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDrawingPreferences_userId_key" ON "UserDrawingPreferences"("userId");

-- CreateIndex
CREATE INDEX "UserDrawingPreferences_userId_idx" ON "UserDrawingPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_id_key" ON "UserPreference"("id");

-- CreateIndex
CREATE INDEX "UserPreference_client_user_idx" ON "UserPreference"("client", "user");

-- CreateIndex
CREATE INDEX "Watchlist_userId_createdAt_idx" ON "Watchlist"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Watchlist_userId_isDefault_idx" ON "Watchlist"("userId", "isDefault");

-- CreateIndex
CREATE INDEX "Watchlist_userId_sortOrder_idx" ON "Watchlist"("userId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_name_key" ON "Watchlist"("userId", "name");

-- CreateIndex
CREATE INDEX "WatchlistItem_exchange_symbol_idx" ON "WatchlistItem"("exchange", "symbol");

-- CreateIndex
CREATE INDEX "WatchlistItem_watchlistId_sortOrder_idx" ON "WatchlistItem"("watchlistId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_watchlistId_exchange_symbol_key" ON "WatchlistItem"("watchlistId", "exchange", "symbol");

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
