import { ChinaFlag, FranceFlag } from "@/components/flags";
import { MediaList } from "@/components/media-list";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  LANGUAGE_LABELS,
  MEDIA,
  MEDIA_TYPE_LABELS,
  type Language,
  type MediaType,
} from "@/lib/media";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function MediaItemsScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  const { lang, type } = useLocalSearchParams<{
    lang: Language;
    type: MediaType;
  }>();
  const language: Language = lang === "fr" ? "fr" : "zh";
  const mediaType: MediaType = type === "videos" ? "videos" : "newspapers";

  const isFrench = language === "fr";
  const accent = isFrench ? c.primaryBlue : c.primaryRed;
  const accentLight = isFrench ? c.lightBlue : c.lightRed;

  const title = `${LANGUAGE_LABELS[language]} ${MEDIA_TYPE_LABELS[mediaType]}`;

  // Reflect the selection in the native header.
  useEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return (
    <MediaList
      title={title}
      subtitle="Top 5 to practise with" 
      accent={accent}
      accentLight={accentLight}
      flag={isFrench ? <FranceFlag size={48} /> : <ChinaFlag size={48} />}
      items={MEDIA[language][mediaType]}
    />
  );
}
