#!/usr/bin/env bash
set -euo pipefail

WP_PATH="/var/www/html"
WP_DB_HOST="${WP_DB_HOST:-db_wp}"
WP_URL="${WP_URL:-http://localhost:8080}"
SEED_DIR="/seed/ux"

export WP_CLI_ALLOW_ROOT=1

wp() {
  php -d memory_limit=256M /usr/local/bin/wp "$@"
}

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
}

ensure_term() {
  local taxonomy="$1"
  local slug="$2"
  local name="$3"
  local existing
  existing=$(wp term list "$taxonomy" --slug="$slug" --field=term_id --path="$WP_PATH" | head -n 1)
  if [ -z "$existing" ]; then
    wp term create "$taxonomy" "$name" --slug="$slug" --path="$WP_PATH" >/dev/null
  fi
}

ensure_media() {
  local file_path="$1"
  if [ ! -f "$file_path" ]; then
    echo ""
    return
  fi

  local base_name
  base_name=$(basename "$file_path")
  local slug
  slug=$(slugify "${base_name%.*}")

  local existing
  existing=$(wp post list --post_type=attachment --name="$slug" --field=ID --path="$WP_PATH" | head -n 1)
  if [ -n "$existing" ]; then
    echo "$existing"
    return
  fi

  wp media import "$file_path" --porcelain --path="$WP_PATH"
}

seed_post() {
  local slug="$1"
  local title="$2"
  local category_slug="$3"
  local tags="$4"
  local image_id="$5"
  local excerpt="$6"
  local content="$7"

  local existing_id
  existing_id=$(wp post list --post_type=post --name="$slug" --field=ID --path="$WP_PATH" | head -n 1)

  if [ -z "$existing_id" ]; then
    local category_id
    category_id=$(wp term list category --slug="$category_slug" --field=term_id --path="$WP_PATH" | head -n 1)
    existing_id=$(wp post create \
      --post_type=post \
      --post_status=publish \
      --post_title="$title" \
      --post_name="$slug" \
      --post_category="$category_id" \
      --tags_input="$tags" \
      --post_excerpt="$excerpt" \
      --post_content="$content" \
      --porcelain \
      --path="$WP_PATH")
  fi

  if [ -n "$image_id" ]; then
    wp post meta update "$existing_id" _thumbnail_id "$image_id" --path="$WP_PATH" >/dev/null
  fi
}

echo "[wp-entrypoint] Waiting for database at ${WP_DB_HOST}..."
until mysqladmin ping -h "${WP_DB_HOST}" -u root -p"${MYSQL_ROOT_PASSWORD}" --silent; do
  sleep 2
  echo "[wp-entrypoint] Still waiting for database..."
done

echo "[wp-entrypoint] Database is up. Preparing WordPress..."

if [ ! -f "${WP_PATH}/wp-includes/version.php" ]; then
  wp core download --path="${WP_PATH}" --force
fi

if [ ! -f "${WP_PATH}/wp-config.php" ]; then
  wp config create \
    --path="${WP_PATH}" \
    --dbname="${MYSQL_DATABASE}" \
    --dbuser="${MYSQL_USER}" \
    --dbpass="${MYSQL_PASSWORD}" \
    --dbhost="${WP_DB_HOST}" \
    --skip-check \
    --extra-php <<'PHP'
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('GRAPHQL_DEBUG', true);
PHP
fi

if ! wp core is-installed --path="${WP_PATH}"; then
  wp core install \
    --path="${WP_PATH}" \
    --url="${WP_URL}" \
    --title="${WP_TITLE}" \
    --admin_user="${WP_ADMIN_USER}" \
    --admin_password="${WP_ADMIN_PASSWORD}" \
    --admin_email="${WP_ADMIN_EMAIL}" \
    --skip-email
fi

wp option update home "${WP_URL}" --path="${WP_PATH}"
wp option update siteurl "${WP_URL}" --path="${WP_PATH}"

if ! wp plugin is-installed wp-graphql --path="${WP_PATH}"; then
  wp plugin install wp-graphql --activate --path="${WP_PATH}"
else
  wp plugin activate wp-graphql --path="${WP_PATH}"
fi

if wp theme is-installed headless --path="${WP_PATH}"; then
  wp theme activate headless --path="${WP_PATH}"
fi

wp rewrite structure '/%postname%/' --hard --path="${WP_PATH}"
wp rewrite flush --hard --path="${WP_PATH}"

echo "[wp-entrypoint] Seeding content..."

category_items=(
  "getting-started|Getting Started"
  "advanced-features|Advanced Features"
  "voice-mode|Voice Mode"
  "images|Images"
  "files-analysis|Files & Analysis"
  "deep-research|Deep Research"
  "custom-gpts|Custom GPTs"
)

for item in "${category_items[@]}"; do
  IFS="|" read -r slug name <<<"$item"
  ensure_term "category" "$slug" "$name"
done

tag_items=(
  "chatgpt|ChatGPT"
  "plus|Plus"
  "gpt-5|GPT-5"
  "gpt-4o|GPT-4o"
  "voice|Voice"
  "images|Images"
  "files|Files"
  "research|Research"
  "gpts|GPTs"
)

for item in "${tag_items[@]}"; do
  IFS="|" read -r slug name <<<"$item"
  ensure_term "post_tag" "$slug" "$name"
done

MEDIA_HOME=$(ensure_media "${SEED_DIR}/home_(marketing)_page/screen.png")
MEDIA_BLOG=$(ensure_media "${SEED_DIR}/blog_index_page/screen.png")
MEDIA_POST=$(ensure_media "${SEED_DIR}/post_detail_page/screen.png")

content_plus=$(cat <<'HTML'
<h2 id="intro" class="scroll-mt-28">Introduction</h2>
<p>ChatGPT Plus unlocks higher limits and premium models for faster, more reliable work sessions.</p>
<div class="callout-note">
  <strong>Note:</strong> Plus focuses on model access and tool availability, not long-term storage.
</div>
<h2 id="benefits" class="scroll-mt-28">1. What you get</h2>
<p>Priority access, GPT-4o, image generation, file analysis, and voice mode are bundled into one plan.</p>
<pre><code>Plus perks:
- Higher message limits
- GPT-4o + tools
- Faster responses</code></pre>
<div class="callout-tip">
  <strong>Tip:</strong> Use Plus for deep work sessions when you need reliable capacity.
</div>
<h2 id="setup" class="scroll-mt-28">2. Getting started</h2>
<p>Upgrade, then verify advanced tools from the model selector and the tools panel.</p>
<div class="callout-warning">
  <strong>Warning:</strong> Usage limits still apply, so plan around peak hours.
</div>
<h2 id="pitfalls" class="scroll-mt-28">3. Common pitfalls</h2>
<p>Do not assume Plus enables unlimited requests. Track usage across text, vision, and voice.</p>
HTML
)

content_voice=$(cat <<'HTML'
<h2 id="intro" class="scroll-mt-28">Introduction</h2>
<p>Voice mode is best for brainstorming, walkthroughs, and hands-free planning.</p>
<div class="callout-note">
  <strong>Note:</strong> A quiet room improves accuracy and response speed.
</div>
<h2 id="setup" class="scroll-mt-28">1. Set up your session</h2>
<p>Pick a model optimized for voice, then outline the goal before you start speaking.</p>
<pre><code>Session starter:
- Goal
- Constraints
- Output format</code></pre>
<div class="callout-tip">
  <strong>Tip:</strong> Summarize every 2-3 minutes to keep the model aligned.
</div>
<h2 id="workflow" class="scroll-mt-28">2. Build a workflow</h2>
<p>Use short prompts, confirm assumptions, then switch to text for structured outputs.</p>
<div class="callout-warning">
  <strong>Warning:</strong> Long, unstructured monologues reduce accuracy.
</div>
<h2 id="pitfalls" class="scroll-mt-28">3. Common pitfalls</h2>
<p>Voice is great for ideation, but always confirm details in a written follow-up.</p>
HTML
)

content_images=$(cat <<'HTML'
<h2 id="intro" class="scroll-mt-28">Introduction</h2>
<p>Image generation shines when you guide style, subject, and composition with intent.</p>
<div class="callout-note">
  <strong>Note:</strong> Always provide a clear subject and style reference.
</div>
<h2 id="prompting" class="scroll-mt-28">1. Prompt structure</h2>
<p>Use a prompt that includes subject, style, lighting, and framing.</p>
<pre><code>Prompt formula:
- Subject
- Style
- Lighting
- Camera angle</code></pre>
<div class="callout-tip">
  <strong>Tip:</strong> Iterate on a single parameter at a time.
</div>
<h2 id="workflow" class="scroll-mt-28">2. Workflow tips</h2>
<p>Generate variations, then refine the best one with specific changes.</p>
<div class="callout-warning">
  <strong>Warning:</strong> Avoid overloading prompts with conflicting styles.
</div>
<h2 id="pitfalls" class="scroll-mt-28">3. Common pitfalls</h2>
<p>Do not expect perfect results on the first try. Iterate quickly.</p>
HTML
)

content_files=$(cat <<'HTML'
<h2 id="intro" class="scroll-mt-28">Introduction</h2>
<p>File uploads let you summarize, analyze, and visualize data in minutes.</p>
<div class="callout-note">
  <strong>Note:</strong> Name columns clearly to help the model map metrics.
</div>
<h2 id="prepare" class="scroll-mt-28">1. Prepare your file</h2>
<p>Clean headers, remove empty columns, and provide a short objective.</p>
<pre><code>Checklist:
- Clean headers
- Remove empty columns
- Add a short objective</code></pre>
<div class="callout-tip">
  <strong>Tip:</strong> Ask for a summary before requesting charts.
</div>
<h2 id="analysis" class="scroll-mt-28">2. Analysis workflow</h2>
<p>Request summary, then drill into key metrics with follow-up prompts.</p>
<div class="callout-warning">
  <strong>Warning:</strong> Validate numbers before sharing externally.
</div>
<h2 id="pitfalls" class="scroll-mt-28">3. Common pitfalls</h2>
<p>Do not skip validation. Treat outputs as a draft to verify.</p>
HTML
)

content_research=$(cat <<'HTML'
<h2 id="intro" class="scroll-mt-28">Introduction</h2>
<p>Deep Research combines browsing and synthesis to create an expert-level brief.</p>
<div class="callout-note">
  <strong>Note:</strong> Start with a focused question and a target audience.
</div>
<h2 id="scope" class="scroll-mt-28">1. Define the scope</h2>
<p>Clarify the question, constraints, and the output format you need.</p>
<pre><code>Research brief:
- Question
- Audience
- Output format</code></pre>
<div class="callout-tip">
  <strong>Tip:</strong> Ask for a list of sources before synthesis.
</div>
<h2 id="synthesis" class="scroll-mt-28">2. Synthesis workflow</h2>
<p>Request a summary, then drill down with follow-up prompts.</p>
<div class="callout-warning">
  <strong>Warning:</strong> Verify critical facts from primary sources.
</div>
<h2 id="pitfalls" class="scroll-mt-28">3. Common pitfalls</h2>
<p>Do not rely on a single source. Cross-check before decisions.</p>
HTML
)

content_custom=$(cat <<'HTML'
<h2 id="intro" class="scroll-mt-28">Introduction</h2>
<p>Custom GPTs help you standardize prompts, tools, and knowledge for repeatable tasks.</p>
<div class="callout-note">
  <strong>Note:</strong> Define a narrow scope for best results.
</div>
<h2 id="setup" class="scroll-mt-28">1. Configure instructions</h2>
<p>Write clear guardrails, outputs, and tone guidance.</p>
<pre><code>Instruction skeleton:
- Role
- Inputs
- Outputs
- Tone</code></pre>
<div class="callout-tip">
  <strong>Tip:</strong> Use small knowledge files and iterate.
</div>
<h2 id="workflow" class="scroll-mt-28">2. Build a workflow</h2>
<p>Test the GPT across multiple scenarios before sharing it.</p>
<div class="callout-warning">
  <strong>Warning:</strong> Avoid exposing sensitive data in knowledge files.
</div>
<h2 id="pitfalls" class="scroll-mt-28">3. Common pitfalls</h2>
<p>Do not overcomplicate the prompt. Keep it focused.</p>
HTML
)

seed_post \
  "what-is-plus" \
  "ChatGPT Plus: what you get and how to use it" \
  "getting-started" \
  "chatgpt,plus,gpt-4o" \
  "$MEDIA_HOME" \
  "A complete overview of ChatGPT Plus and how to use it effectively." \
  "$content_plus"

seed_post \
  "voice-mode-effectively" \
  "Using Voice mode effectively" \
  "voice-mode" \
  "chatgpt,voice,plus" \
  "$MEDIA_POST" \
  "Practical tips for getting the most out of Voice mode." \
  "$content_voice"

seed_post \
  "image-generation-workflows" \
  "Image generation workflows" \
  "images" \
  "chatgpt,images,gpt-4o" \
  "$MEDIA_BLOG" \
  "From prompt structure to iteration, learn image workflows." \
  "$content_images"

seed_post \
  "file-uploads-analysis" \
  "File uploads & analysis for reports" \
  "files-analysis" \
  "chatgpt,files,plus" \
  "$MEDIA_POST" \
  "Upload files and turn them into summaries and charts." \
  "$content_files"

seed_post \
  "deep-research-maximum-impact" \
  "Deep Research: When and how to use it for maximum impact" \
  "deep-research" \
  "chatgpt,research,plus" \
  "$MEDIA_BLOG" \
  "Plan a research workflow to get trustworthy summaries." \
  "$content_research"

seed_post \
  "custom-gpts-repeated-tasks" \
  "Creating Custom GPTs for repeated tasks" \
  "custom-gpts" \
  "chatgpt,gpts,plus" \
  "$MEDIA_HOME" \
  "Build custom GPTs that handle repeated tasks." \
  "$content_custom"

chown -R www-data:www-data "${WP_PATH}/wp-content"

exec /usr/local/sbin/php-fpm -F -R
