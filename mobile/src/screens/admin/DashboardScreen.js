import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardSummary } from '../../store/slices/dashboardSlice';
import { logout } from '../../store/slices/authSlice';
import { colors } from '../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { summary, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    dispatch(fetchDashboardSummary());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading && !summary) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadDashboard} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.greeting}>
          Welcome, {user?.name}!
        </Text>
        <Button mode="outlined" onPress={handleLogout} compact>
          Logout
        </Button>
      </View>

      <View style={styles.statsGrid}>
        <Card style={[styles.statCard, { backgroundColor: colors.primary }]}>
          <Card.Content>
            <Icon name="package-variant" size={32} color={colors.white} />
            <Text variant="headlineMedium" style={styles.statValue}>
              {summary?.summary?.totalParts || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Parts
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: colors.success }]}>
          <Card.Content>
            <Icon name="check-circle" size={32} color={colors.white} />
            <Text variant="headlineMedium" style={styles.statValue}>
              {summary?.summary?.inStock || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              In Stock
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: colors.warning }]}>
          <Card.Content>
            <Icon name="alert" size={32} color={colors.white} />
            <Text variant="headlineMedium" style={styles.statValue}>
              {summary?.summary?.lowStock || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Low Stock
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: colors.danger }]}>
          <Card.Content>
            <Icon name="close-circle" size={32} color={colors.white} />
            <Text variant="headlineMedium" style={styles.statValue}>
              {summary?.summary?.outOfStock || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Out of Stock
            </Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Inventory Value" />
        <Card.Content>
          <View style={styles.valueRow}>
            <Text variant="bodyLarge">Cost Value:</Text>
            <Text variant="titleLarge" style={styles.valueText}>
              ${summary?.summary?.inventoryValue?.totalCost?.toFixed(2) || '0.00'}
            </Text>
          </View>
          <View style={styles.valueRow}>
            <Text variant="bodyLarge">Selling Value:</Text>
            <Text variant="titleLarge" style={[styles.valueText, { color: colors.success }]}>
              ${summary?.summary?.inventoryValue?.totalSelling?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Quick Actions" />
        <Card.Content>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate('Parts', { screen: 'AddPart' })}
            style={styles.actionButton}
          >
            Add New Part
          </Button>
          <Button
            mode="outlined"
            icon="format-list-bulleted"
            onPress={() => navigation.navigate('Parts', { screen: 'PartsList' })}
            style={styles.actionButton}
          >
            View All Parts
          </Button>
          <Button
            mode="outlined"
            icon="shape"
            onPress={() => navigation.navigate('Categories')}
            style={styles.actionButton}
          >
            Manage Categories
          </Button>
        </Card.Content>
      </Card>

      {summary?.recentParts && summary.recentParts.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Recently Added Parts" />
          <Card.Content>
            {summary.recentParts.map((part) => (
              <View key={part._id} style={styles.recentItem}>
                <View style={styles.recentInfo}>
                  <Text variant="bodyLarge">{part.name}</Text>
                  <Text variant="bodySmall" style={styles.recentMeta}>
                    {part.partNumber} • {part.brand}
                  </Text>
                </View>
                <Text variant="bodySmall" style={styles.recentDate}>
                  {new Date(part.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
  },
  greeting: {
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    elevation: 2,
  },
  statValue: {
    color: colors.white,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: colors.white,
    opacity: 0.9,
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  valueText: {
    fontWeight: 'bold',
  },
  actionButton: {
    marginVertical: 6,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentInfo: {
    flex: 1,
  },
  recentMeta: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  recentDate: {
    color: colors.textSecondary,
  },
});

export default DashboardScreen;
