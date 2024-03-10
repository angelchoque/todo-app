type Props = Array<string | undefined | null | boolean>;

export default function cx(...classNames: Props) {
  return classNames.filter(Boolean).join(" ");
}
