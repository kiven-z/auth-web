#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
  cat <<'EOF'
用法:
  ./dockerctl.sh <env> <action> [extra args...]

说明:
  只要 compose 文件存在，该环境就合法，无需硬编码环境列表。

支持动作:
  build      构建镜像
  up         后台启动容器
  build-up   构建并后台启动（build + up -d）
  down       停止并清理容器
  restart    重启服务（down + up -d）
  logs       查看并跟踪日志
  ps         查看容器状态
  config     校验并输出 compose 配置

示例:
  ./dockerctl.sh dev up
  ./dockerctl.sh dev build-up
  ./dockerctl.sh test logs -f auth-web
  ./dockerctl.sh prod build --no-cache
EOF
}

resolve_compose_file() {
  local target_env="$1"
  local candidate
  local candidates=(
    "${SCRIPT_DIR}/${target_env}/docker-compose.yml"
    "${SCRIPT_DIR}/compose/docker-compose.${target_env}.yml"
  )

  for candidate in "${candidates[@]}"; do
    if [[ -f "${candidate}" ]]; then
      printf '%s\n' "${candidate}"
      return 0
    fi
  done
  return 1
}

dc() {
  docker compose -f "${COMPOSE_FILE}" "$@"
}

if [[ "${1:-}" == "help" || "${1:-}" == "-h" || "${1:-}" == "--help" || $# -lt 2 ]]; then
  show_help
  exit 0
fi

TARGET_ENV="$1"
ACTION="$2"
shift 2

if ! COMPOSE_FILE="$(resolve_compose_file "${TARGET_ENV}")"; then
  echo "Error: compose file for env '${TARGET_ENV}' not found."
  echo "Checked paths:"
  echo "  - ${SCRIPT_DIR}/${TARGET_ENV}/docker-compose.yml"
  echo "  - ${SCRIPT_DIR}/compose/docker-compose.${TARGET_ENV}.yml"
  exit 1
fi

case "${ACTION}" in
  build)
    dc build "$@"
    ;;
  up)
    dc up -d "$@"
    ;;
  build-up)
    dc build "$@"
    dc up -d "$@"
    ;;
  down)
    dc down "$@"
    ;;
  restart)
    dc down "$@"
    dc up -d "$@"
    ;;
  logs)
    dc logs -f "$@"
    ;;
  ps)
    dc ps "$@"
    ;;
  config)
    dc config "$@"
    ;;
  help|-h|--help)
    show_help
    exit 0
    ;;
  *)
    echo "Error: unsupported action '${ACTION}'."
    show_help
    exit 1
    ;;
esac
