import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#E4E4E4',
    borderBottomWidth: 0.5,
    padding: 15,
    paddingHorizontal: 30,
  },
  backButton: {
    marginRight: 5,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Làm nền mờ nhẹ giống iOS
  },
  modalContainer: {
    width: 320,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15, // Bo góc giống iOS
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10, // Bóng đổ cho Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600', // Font iOS nhẹ hơn
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  cancelText: {
    color: '#007AFF', // Màu xanh iOS
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30', // Đỏ iOS
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  deleteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
