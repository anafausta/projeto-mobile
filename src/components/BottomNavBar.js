import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { fontesDestaque } from '../theme/identidadeVisual';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HouseIcon } from '@solar-icons/react-native/bold-duotone/house'
import { Routing3Icon } from '@solar-icons/react-native/bold-duotone/routing-3'
import { ChecklistMinimalisticIcon } from '@solar-icons/react-native/bold-duotone/checklist-minimalistic'
import { NotebookBookmarkIcon } from '@solar-icons/react-native/bold-duotone/notebook-bookmark'
import { UserCircleIcon } from '@solar-icons/react-native/bold-duotone/user-circle'

export default function BottomNavBar({
  telaAtual,
  irParaHome,
  irParaTrilha,
  irParaSimulados,
  irParaArtigos,
  irParaPerfil,
}) {

  const insets = useSafeAreaInsets();

  const tabs = [
    {
      id: 'home',
      label: 'Início',
      icone: HouseIcon,
      ativo: telaAtual === 'home',
      onPress: irParaHome,
    },
    {
      id: 'trilhas',
      label: 'Trilhas',
      icone: Routing3Icon ,
      ativo: telaAtual.startsWith('trilha'),
      onPress: irParaTrilha,
    },
    {
      id: 'simulados',
      label: 'Simulados',
      icone: ChecklistMinimalisticIcon,
      ativo: telaAtual.startsWith('simulado'),
      onPress: irParaSimulados,
    },
    {
      id: 'artigos',
      label: 'Artigos',
      icone: NotebookBookmarkIcon,
      ativo: telaAtual.startsWith('artigo'),
      onPress: irParaArtigos,
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icone: UserCircleIcon,
      ativo: telaAtual === 'perfil',
      onPress: irParaPerfil,
    },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom +6 : 12 }]}>    
        {tabs.map((tab) => {
        const Icone = tab.icone;
        const estaAtivo = tab.ativo;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabBtn}
            onPress={tab.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconeBox, estaAtivo && styles.iconeBoxAtivo]}>
              <Icone
                color={estaAtivo ? '#6500B8' : '#94A3B8'}
                size={22}
                strokeWidth={estaAtivo ? 2.5 : 2}
              />
            </View>
            <Text style={[styles.label, estaAtivo && styles.labelAtivo]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconeBox: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 2,
  },
  iconeBoxAtivo: {
    backgroundColor: '#F3E8FF',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  labelAtivo: {
    color: '#6500B8',
    fontWeight: 'bold',
    fontFamily: fontesDestaque.bold,
  },
});
