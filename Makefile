
install:
	pnpm install
dev:
	pnpm dev

build:
	pnpm build

preview:
	pnpm preview
	
lint:
	pnpm lint

test:
	pnpm test

typecheck:
	pnpm typecheck

add-package:
	turbo gen package

pre-commit:
	.husky/pre-commit

pre-push:
	.husky/pre-push
